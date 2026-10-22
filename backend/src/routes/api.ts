import { Router } from "express";
import { z } from "zod";
import { chroma } from "../services/chroma.js";
import { indexRepository } from "../services/repository-indexer.js";
import {
  answerRepositoryQuestion,
  getRepositoryInsights,
} from "../services/retrieval.js";
import { ollama } from "../services/ollama.js";
import { parseRepositoryUrl } from "../services/github.js";
import { HttpError } from "../utils/errors.js";

export const apiRouter = Router();

const repositoryBody = z.object({
  repositoryUrl: z.url(),
});

const questionBody = repositoryBody.extend({
  question: z.string().trim().min(1).max(4_000),
});

function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.message);
  }
  return parsed.data;
}

apiRouter.get("/health", async (_request, response) => {
  const dependencies = {
    chroma: false,
    ollama: false,
  };
  const checks = await Promise.allSettled([
    chroma.heartbeat(),
    ollama.list(),
  ]);

  dependencies.chroma = checks[0].status === "fulfilled";
  dependencies.ollama = checks[1].status === "fulfilled";
  const ready = dependencies.chroma && dependencies.ollama;

  response.status(ready ? 200 : 503).json({
    status: ready ? "ok" : "degraded",
    dependencies,
  });
});

apiRouter.post("/repositories/index", async (request, response) => {
  const { repositoryUrl } = parseBody(repositoryBody, request.body);
  const result = await indexRepository(repositoryUrl);
  response.status(200).json(result);
});

apiRouter.post("/chat", async (request, response) => {
  const { repositoryUrl, question } = parseBody(questionBody, request.body);
  const repository = parseRepositoryUrl(repositoryUrl);
  const result = await answerRepositoryQuestion(
    repository.canonicalUrl,
    question,
  );
  response.json(result);
});

apiRouter.get("/insights", async (request, response) => {
  const parsedUrl = z.url().safeParse(request.query.repositoryUrl);
  if (!parsedUrl.success) {
    throw new HttpError(400, "Provide a valid repositoryUrl query parameter.");
  }

  const repository = parseRepositoryUrl(parsedUrl.data);
  const insights = await getRepositoryInsights(repository.canonicalUrl);
  response.json({
    repository: repository.canonicalUrl,
    ...insights,
  });
});
