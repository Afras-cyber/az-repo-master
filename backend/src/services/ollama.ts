import { Ollama } from "ollama";
import { env } from "../config/env.js";

export const ollama = new Ollama({ host: env.OLLAMA_URL });

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const response = await ollama.embed({
    model: env.OLLAMA_EMBED_MODEL,
    input: texts,
  });

  if (response.embeddings.length !== texts.length) {
    throw new Error("Ollama returned an unexpected number of embeddings.");
  }

  return response.embeddings;
}
