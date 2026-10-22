import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.info(`RepoMind API listening on http://localhost:${env.PORT}`);
});

function shutdown(signal: string) {
  console.info(`${signal} received; closing API server.`);
  server.close((error) => {
    if (error) {
      console.error("Failed to close API server cleanly:", error);
      process.exitCode = 1;
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
