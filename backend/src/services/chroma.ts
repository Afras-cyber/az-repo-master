import { ChromaClient } from "chromadb";
import { env } from "../config/env.js";

const chromaUrl = new URL(env.CHROMA_URL);

export const chroma = new ChromaClient({
  host: chromaUrl.hostname,
  port: Number(chromaUrl.port || (chromaUrl.protocol === "https:" ? 443 : 80)),
  ssl: chromaUrl.protocol === "https:",
});

export function getRepositoryCollection() {
  return chroma.getOrCreateCollection({
    name: "repository_chunks",
    metadata: { "hnsw:space": "cosine" },
    embeddingFunction: null,
  });
}
