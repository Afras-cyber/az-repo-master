import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  OLLAMA_URL: z.url().default("http://localhost:11434"),
  OLLAMA_CHAT_MODEL: z.string().min(1).default("llama3.2"),
  OLLAMA_EMBED_MODEL: z.string().min(1).default("nomic-embed-text"),
  CHROMA_URL: z.url().default("http://localhost:8000"),
  GITHUB_TOKEN: z.string().default(""),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid backend environment: ${parsedEnv.error.message}`);
}

export const env = parsedEnv.data;
export const corsOrigins = env.CORS_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
