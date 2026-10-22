"use client";

import { useState } from "react";

const files = [
  {
    path: "README.md",
    lines: [
      "# Shop API",
      "",
      "A simple API for managing products and orders.",
      "",
      "## Getting started",
      "",
      "Install dependencies and start the development server:",
      "",
      "npm install",
      "npm run dev",
    ],
  },
  {
    path: "src/auth.ts",
    lines: [
      "import jwt from 'jsonwebtoken';",
      "import { verify } from './hash';",
      "",
      "export async function login(email, password) {",
      "  const user = await db.users.find(email);",
      "  if (!user) throw new AuthError();",
      "",
      "",
      "  // no rate limiting yet",
      "  const ok = await verify(password, user.hash);",
      "  if (!ok) throw new AuthError();",
      "  return jwt.sign({ id: user.id }, SECRET);",
      "}",
    ],
  },
  {
    path: "src/middleware.ts",
    lines: [
      "import { verifyToken } from './auth';",
      "",
      "export async function requireUser(request, next) {",
      "  const token = request.headers.authorization;",
      "  if (!token) throw new AuthError();",
      "",
      "  const user = await verifyToken(token);",
      "  request.user = user;",
      "  return next();",
      "}",
    ],
  },
  {
    path: "src/api/client.ts",
    lines: [
      "const API_URL = process.env.API_URL;",
      "",
      "export async function request(path, options = {}) {",
      "  const response = await fetch(`${API_URL}${path}`, {",
      "    ...options,",
      "    headers: {",
      "      'Content-Type': 'application/json',",
      "      ...options.headers,",
      "    },",
      "  });",
      "",
      "  if (!response.ok) throw new Error('Request failed');",
      "  return response.json();",
      "}",
    ],
  },
] as const;

export default function CodePage() {
  const [selectedPath, setSelectedPath] = useState<string>("src/auth.ts");
  const selectedFile =
    files.find((file) => file.path === selectedPath) ?? files[1];

  return (
    <main className="mx-auto w-full max-w-content px-5 py-6 desktop:px-9 desktop:py-7">
      <header className="mb-5">
        <h1 className="text-2xl font-bold leading-heading tracking-tight text-text desktop:text-heading1">
          Understand any public repository
        </h1>
        <p className="mt-1 text-body leading-body text-text-muted desktop:text-heading2">
          Ask questions and get answers that point to the exact source lines.
        </p>
      </header>

      <form className="mb-4 flex flex-col gap-3 desktop:flex-row">
        <label className="sr-only" htmlFor="repository-url">
          Public GitHub repository URL
        </label>
        <input
          id="repository-url"
          type="url"
          defaultValue="https://github.com/acme/shop-api"
          placeholder="https://github.com/owner/repository"
          className="min-w-0 flex-1 rounded-control border border-border bg-surface px-4 py-3 text-body text-text outline-none transition placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="button"
          className="shrink-0 rounded-control bg-accent px-5 py-3 text-body font-bold text-accent-on transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Analyze repository
        </button>
      </form>

      <div className="grid items-stretch gap-4 desktop:grid-cols-[300px_minmax(0,1fr)]">
        <section
          aria-labelledby="files-heading"
          className="rounded-card border border-border bg-surface p-4 desktop:p-5"
        >
          <h2
            id="files-heading"
            className="mb-3 text-heading2 font-bold leading-heading text-text"
          >
            Files
          </h2>
          <nav aria-label="Repository files" className="flex flex-col gap-1">
            {files.map((file) => {
              const selected = selectedPath === file.path;

              return (
                <button
                  key={file.path}
                  type="button"
                  aria-current={selected ? "page" : undefined}
                  onClick={() => setSelectedPath(file.path)}
                  className={`w-full rounded-control border px-3 py-2.5 text-left font-mono text-body transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    selected
                      ? "border-accent bg-accent-soft text-text"
                      : "border-transparent text-text hover:border-border hover:bg-code-background"
                  }`}
                >
                  {file.path}
                </button>
              );
            })}
          </nav>
        </section>

        <section
          aria-labelledby="selected-file-heading"
          className="min-w-0 rounded-card border border-border bg-surface p-4 desktop:p-5"
        >
          <h2
            id="selected-file-heading"
            className="mb-3 truncate text-heading2 font-bold leading-heading text-text"
          >
            {selectedFile.path}
          </h2>
          <div className="max-h-[min(65vh,640px)] min-h-80 overflow-auto rounded-control bg-code-background py-3 font-mono text-body leading-[1.8] text-text">
            <pre aria-label={`Source code from ${selectedFile.path}`}>
              <code>
                {selectedFile.lines.map((line, index) => (
                  <span
                    key={`${selectedFile.path}-${index}`}
                    className="grid min-w-max grid-cols-[3rem_1fr] pr-4"
                  >
                    <span
                      aria-hidden="true"
                      className="select-none pr-4 text-right text-text-muted"
                    >
                      {index + 1}
                    </span>
                    <span>{line || "\u00a0"}</span>
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
