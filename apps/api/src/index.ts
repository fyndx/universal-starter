import { etag } from "@bogeychan/elysia-etag";
import { type pino, wrap } from "@bogeychan/elysia-logger";
import cors from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { staticPlugin } from "@elysiajs/static";
import { validateOrigin } from "@src/cors";
import { auth } from "@src/lib/auth";
import { instrumentation } from "@src/lib/instrumentation";
import { meRoutes } from "@src/modules/me";
import { elysiaLogger } from "@universal/logger";
import { Elysia } from "elysia";

const PORT = 3000;

export const app = new Elysia({ prefix: "/api" })
  // Core
  .use(instrumentation)
  .use(wrap(elysiaLogger as pino.Logger, {}))
  .use(
    openapi({
      references: fromTypes(),
    })
  )
  .use(serverTiming())
  .use(
    staticPlugin({
      assets: "public",
      prefix: "/static",
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    })
  )
  .use(etag())
  .use(
    cors({
      origin: (request: Request) => {
        // const ALLOWED_ORIGINS = [
        // 	"http://localhost:8081",
        // 	// /^https:\/\/.*\.expo\.app$/,
        // 	"https://*.expo.app",
        // ];

        const origin = request.headers.get("origin") || "";
        return validateOrigin(origin);
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .mount(auth.handler)
  .get("/", () => "Hello Elysia", {
    detail: {
      tags: ["App"],
    },
  })
  .get(
    "/health",
    () => {
      return {
        uptime: process.uptime(),
        message: "OK",
        timestamp: Date.now(),
      };
    },
    {
      detail: {
        tags: ["App"],
        description: "Health check endpoint",
        summary: "Health Check",
      },
    }
  )
  .use(meRoutes())
  .listen(PORT, () => {
    elysiaLogger.info(`🚀 API Server running at http://localhost:${PORT}/api`);
  });

export type App = typeof app;
