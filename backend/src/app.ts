import cors from "cors";
import express, {
  type ErrorRequestHandler,
  type Request,
  type Response,
} from "express";
import { corsOrigins } from "./config/env.js";
import { apiRouter } from "./routes/api.js";
import { HttpError } from "./utils/errors.js";

export const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new HttpError(403, "Origin is not allowed by CORS."));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));
app.get("/", (_request: Request, response: Response) => {
  response.json({ name: "RepoMind API", health: "/api/health" });
});
app.use("/api", apiRouter);

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found." });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next;

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (
    error instanceof SyntaxError &&
    "status" in error &&
    error.status === 400
  ) {
    response.status(400).json({ error: "Request body must be valid JSON." });
    return;
  }

  console.error("Unhandled API error:", error);
  response.status(500).json({ error: "An unexpected server error occurred." });
};

app.use(errorHandler);
