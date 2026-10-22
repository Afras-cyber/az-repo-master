# RepoMind

RepoMind is a Next.js interface with a separate Node.js API for indexing public
GitHub repositories and answering questions from retrieved source code.

## Backend structure

```text
backend/
  src/
    config/       Environment validation
    routes/       Health, indexing, chat, and insight endpoints
    services/     GitHub, Ollama, ChromaDB, indexing, and retrieval
    utils/        Errors and source chunking
    app.ts        Express application
    server.ts     Node.js entry point
  .env.example
  package.json
  tsconfig.json
docker-compose.yml
```

## Local setup

Requirements: Node.js 20+, Docker, and [Ollama](https://ollama.com/) installed.

1. Install the frontend and API dependencies:

   ```bash
   npm install
   npm install --prefix backend
   ```

2. Start ChromaDB:

   ```bash
   docker compose up -d chroma
   ```

3. Start Ollama and download the default models:

   ```bash
   ollama serve
   ollama pull llama3.2
   ollama pull nomic-embed-text
   ```

4. Copy `backend/.env.example` to `backend/.env` and adjust settings if needed.
   For repositories you do not own, an optional GitHub token can improve API
   rate limits.

5. Run the UI and API in separate terminals:

   ```bash
   npm run dev
   npm run backend:dev
   ```

The UI runs at `http://localhost:3000`; the API runs at
`http://localhost:4000`.

## API

- `GET /api/health` — API and dependency readiness
- `POST /api/repositories/index` — fetch and index a public GitHub repository
- `POST /api/chat` — retrieve source chunks and answer a repository question
- `GET /api/insights?repositoryUrl=...` — indexed file and chunk counts

Example:

```bash
curl -X POST http://localhost:4000/api/repositories/index \
  -H 'Content-Type: application/json' \
  -d '{"repositoryUrl":"https://github.com/owner/repository"}'
```

```bash
curl -X POST http://localhost:4000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"repositoryUrl":"https://github.com/owner/repository","question":"How does authentication work?"}'
```

The API indexes text source files only, skips common generated/dependency
directories and sensitive-looking files, and limits each repository to 200
files. Indexing, chat, and insights endpoints are implemented separately from
the current UI mockups; wire the UI forms to these endpoints to enable live
repository analysis.

Build the API with `npm run backend:build`.
