import { env } from "../config/env.js";
import { HttpError } from "../utils/errors.js";

const GITHUB_API = "https://api.github.com";
const RAW_GITHUB = "https://raw.githubusercontent.com";
const MAX_FILE_BYTES = 128 * 1024;
const MAX_FILES = 200;
const FILE_CONCURRENCY = 8;

const textExtensions = new Set([
  ".c",
  ".cc",
  ".cpp",
  ".cs",
  ".css",
  ".go",
  ".h",
  ".html",
  ".java",
  ".js",
  ".jsx",
  ".json",
  ".kt",
  ".md",
  ".mjs",
  ".py",
  ".rb",
  ".rs",
  ".sh",
  ".sql",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const ignoredDirectories = new Set([
  ".git",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "vendor",
]);

interface GitHubRepository {
  default_branch: string;
  full_name: string;
  private: boolean;
}

interface GitHubTreeEntry {
  path: string;
  size?: number;
  type: string;
}

interface GitHubTree {
  truncated: boolean;
  tree: GitHubTreeEntry[];
}

export interface RepositoryFile {
  path: string;
  content: string;
}

export interface ParsedRepository {
  owner: string;
  name: string;
  id: string;
  canonicalUrl: string;
}

export function parseRepositoryUrl(value: string): ParsedRepository {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new HttpError(400, "Enter a valid public GitHub repository URL.");
  }

  const segments = url.pathname.split("/").filter(Boolean);
  const [owner, rawName, ...remaining] = segments;
  const name = rawName?.replace(/\.git$/i, "");
  const validSegment = /^[A-Za-z0-9_.-]+$/;

  if (
    url.protocol !== "https:" ||
    url.hostname !== "github.com" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    remaining.length > 0 ||
    !owner ||
    !name ||
    !validSegment.test(owner) ||
    !validSegment.test(name) ||
    owner === "." ||
    owner === ".." ||
    name === "." ||
    name === ".."
  ) {
    throw new HttpError(400, "Enter a public GitHub URL in owner/repository form.");
  }

  const canonicalUrl = `https://github.com/${owner}/${name}`;

  return {
    owner,
    name,
    id: canonicalUrl.toLowerCase(),
    canonicalUrl,
  };
}

function githubHeaders(): Record<string, string> {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` }
      : {}),
  };
}

async function fetchGitHubJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: githubHeaders(),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new HttpError(404, "Repository or its default branch was not found.");
    }
    if (response.status === 403 || response.status === 429) {
      throw new HttpError(503, "GitHub rate limit reached. Try again later.");
    }
    throw new HttpError(502, `GitHub API request failed (${response.status}).`);
  }

  return (await response.json()) as T;
}

function isIndexable(entry: GitHubTreeEntry): boolean {
  const pathSegments = entry.path.split("/");
  const filename = pathSegments.at(-1)?.toLowerCase() ?? "";
  const extension = filename.includes(".")
    ? filename.slice(filename.lastIndexOf("."))
    : "";

  if (
    entry.type !== "blob" ||
    !textExtensions.has(extension) ||
    (entry.size !== undefined && entry.size > MAX_FILE_BYTES) ||
    pathSegments.some((segment) => ignoredDirectories.has(segment.toLowerCase())) ||
    filename.startsWith(".env") ||
    filename.includes("secret") ||
    filename.includes("credential") ||
    filename.endsWith(".pem") ||
    filename.endsWith(".key")
  ) {
    return false;
  }

  return true;
}

function rawFileUrl(
  owner: string,
  name: string,
  branch: string,
  path: string,
): string {
  const encodedBranch = branch.split("/").map(encodeURIComponent).join("/");
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${RAW_GITHUB}/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/${encodedBranch}/${encodedPath}`;
}

async function fetchRawFile(
  owner: string,
  name: string,
  branch: string,
  entry: GitHubTreeEntry,
): Promise<RepositoryFile | null> {
  const response = await fetch(rawFileUrl(owner, name, branch, entry.path), {
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new HttpError(502, `Could not fetch repository file: ${entry.path}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > MAX_FILE_BYTES) return null;

  try {
    const content = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { path: entry.path, content };
  } catch {
    return null;
  }
}

export async function fetchRepositoryFiles(
  repository: ParsedRepository,
): Promise<{ branch: string; files: RepositoryFile[]; truncated: boolean }> {
  const apiRoot = `${GITHUB_API}/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}`;
  const info = await fetchGitHubJson<GitHubRepository>(apiRoot);

  if (info.private) {
    throw new HttpError(400, "Only public repositories can be indexed.");
  }

  const tree = await fetchGitHubJson<GitHubTree>(
    `${apiRoot}/git/trees/${encodeURIComponent(info.default_branch)}?recursive=1`,
  );

  if (tree.truncated) {
    throw new HttpError(
      413,
      "This repository tree is too large to index in one request.",
    );
  }

  const candidates = tree.tree.filter(isIndexable);
  const selected = candidates.slice(0, MAX_FILES);
  const files: RepositoryFile[] = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < selected.length) {
      const entry = selected[nextIndex];
      nextIndex += 1;
      const file = await fetchRawFile(
        repository.owner,
        repository.name,
        info.default_branch,
        entry,
      );
      if (file) files.push(file);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(FILE_CONCURRENCY, selected.length) },
      () => worker(),
    ),
  );

  return {
    branch: info.default_branch,
    files,
    truncated: candidates.length > MAX_FILES,
  };
}
