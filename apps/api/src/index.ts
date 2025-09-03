import { etag } from "@bogeychan/elysia-etag";
import { type pino, wrap } from "@bogeychan/elysia-logger";
import cors from "@elysiajs/cors";
import { serverTiming } from "@elysiajs/server-timing";
import { staticPlugin } from "@elysiajs/static";
import swagger from "@elysiajs/swagger";
import { validateOrigin } from "@src/cors";
import { auth } from "@src/lib/auth";
import { instrumentation } from "@src/lib/instrumentation";
import { OpenAPI } from "@src/lib/open-api";
import { meRoutes } from "@src/modules/me";
import { elysiaLogger } from "@universal/logger";
import { Elysia } from "elysia";

const PORT = 3000;

const app = new Elysia({ prefix: "/api" })
  // Core
  .use(instrumentation)
  .use(wrap(elysiaLogger as pino.Logger, {}))
  .use(
    swagger({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
        tags: [{ name: "App", description: "General endpoints" }],
      },
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
  .listen(PORT);

export type App = typeof app;
