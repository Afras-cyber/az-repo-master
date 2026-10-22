import { createHash } from "node:crypto";
import type { Metadata } from "chromadb";
import { getRepositoryCollection } from "./chroma.js";
import { fetchRepositoryFiles, parseRepositoryUrl } from "./github.js";
import { embedTexts } from "./ollama.js";
import { chunkFiles } from "../utils/chunking.js";
import { HttpError } from "../utils/errors.js";

const EMBEDDING_BATCH_SIZE = 24;
const MAX_CHUNKS_PER_REPOSITORY = 5_000;

function createChunkId(
  repositoryId: string,
  filePath: string,
  startLine: number,
): string {
  return createHash("sha256")
    .update(`${repositoryId}\0${filePath}\0${startLine}`)
    .digest("hex");
}

export async function indexRepository(repositoryUrl: string) {
  const repository = parseRepositoryUrl(repositoryUrl);
  const { branch, files, truncated } = await fetchRepositoryFiles(repository);

  if (files.length === 0) {
    throw new HttpError(422, "No supported text files were found to index.");
  }

  const chunks = chunkFiles(files, (path, line) =>
    createChunkId(repository.id, path, line),
  );

  if (chunks.length > MAX_CHUNKS_PER_REPOSITORY) {
    throw new HttpError(
      413,
      "Repository produced too many text chunks to index in one request.",
    );
  }

  if (chunks.length === 0) {
    throw new HttpError(422, "No non-empty source chunks were found.");
  }

  const collection = await getRepositoryCollection();
  const existing = await collection.get({
    where: { repoId: repository.id },
    include: ["metadatas"],
  });
  const embeddings: number[][] = [];

  for (let offset = 0; offset < chunks.length; offset += EMBEDDING_BATCH_SIZE) {
    const batch = chunks.slice(offset, offset + EMBEDDING_BATCH_SIZE);
    embeddings.push(...(await embedTexts(batch.map((chunk) => chunk.text))));
  }

  const metadata: Metadata[] = chunks.map((chunk) => ({
    repoId: repository.id,
    filePath: chunk.filePath,
    startLine: chunk.startLine,
    endLine: chunk.endLine,
  }));

  await collection.upsert({
    ids: chunks.map((chunk) => chunk.id),
    embeddings,
    documents: chunks.map((chunk) => chunk.text),
    metadatas: metadata,
  });

  const currentIds = new Set(chunks.map((chunk) => chunk.id));
  const obsoleteIds = existing.ids.filter((id) => !currentIds.has(id));

  if (obsoleteIds.length > 0) {
    await collection.delete({ ids: obsoleteIds });
  }

  return {
    repository: repository.canonicalUrl,
    branch,
    fileCount: files.length,
    chunkCount: chunks.length,
    truncated,
  };
}
