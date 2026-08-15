import "@src/env";
import { etag } from "@bogeychan/elysia-etag";
import { type pino, wrap } from "@bogeychan/elysia-logger";
import { getStatusCode } from "@readme/http-status-codes";
import cors from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { staticPlugin } from "@elysiajs/static";
import { validateOrigin } from "@src/cors";
import { auth } from "@src/lib/auth";
import { instrumentation } from "@src/lib/instrumentation";
import { meRoutes } from "@src/modules/me";
import { adminRoutes } from "@src/modules/admin";
import { formatErrorResponse } from "@src/utils/format-response";
import { elysiaLogger } from "@universal/logger";
import { Elysia } from "elysia";

const PORT = 3000;

export const app = new Elysia({ prefix: "/api" })
	// Core
	.use(instrumentation)
	.use(wrap(elysiaLogger as pino.Logger, {}))
	.use(
		openapi({
			// TODO: monorepo issue with typescript types
			// references: fromTypes(
			//   process.env.NODE_ENV === "production"
			//     ? "dist/index.d.ts"
			//     : "src/index.ts",
			//   {
			//     // get the root directory of the project
			//     projectRoot: path.join(import.meta.dir, ".."),
			//     tsconfigPath: path.join(import.meta.dir, "..", "tsconfig.dts.json"),
			//   }
			// ),
		}),
	)
	.use(serverTiming())
	.use(
		staticPlugin({
			assets: "public",
			prefix: "/static",
			headers: { "Cache-Control": "public, max-age=31536000, immutable" },
		}),
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
		}),
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
				description: "Liveness probe — confirms the process is running",
				summary: "Health Check",
			},
		},
	)
	.get(
		"/ready",
		async ({ set }) => {
			const checks: Record<string, "ok" | "fail"> = {};

			// Database ping
			try {
				const { prisma } = await import("@src/infra/db");
				await prisma.$queryRaw`SELECT 1`;
				checks.database = "ok";
			} catch {
				checks.database = "fail";
			}

			// Redis ping
			try {
				const { redisClient } = await import("@universal/redis");
				await redisClient.ping();
				checks.redis = "ok";
			} catch {
				checks.redis = "fail";
			}

			const allOk = Object.values(checks).every((v) => v === "ok");
			const status = allOk ? 200 : 503;
			set.status = status;

			return {
				ready: allOk,
				checks,
				timestamp: Date.now(),
			};
		},
		{
			detail: {
				tags: ["App"],
				description:
					"Readiness probe — confirms DB + Redis are reachable before receiving traffic",
				summary: "Readiness Check",
			},
		},
	)
	.use(meRoutes())
	.use(adminRoutes())
	// ── Graceful shutdown ─────────────────────────────────────────────────
	// Runs when the process receives SIGTERM / SIGINT. Closes open connections
	// (Prisma, Redis) before exiting so no requests are dropped mid-flight.
	.onStop(async () => {
		elysiaLogger.info("Shutting down… closing database + Redis connections");

		await Promise.allSettled([
			(async () => {
				try {
					const { prisma } = await import("@src/infra/db");
					await prisma.$disconnect();
					elysiaLogger.info("Prisma disconnected");
				} catch (err) {
					elysiaLogger.error({ err }, "Error disconnecting Prisma");
				}
			})(),
			(async () => {
				try {
					const { redisClient } = await import("@universal/redis");
					await redisClient.quit();
					elysiaLogger.info("Redis disconnected");
				} catch (err) {
					elysiaLogger.error({ err }, "Error disconnecting Redis");
				}
			})(),
		]);
	})
	// ── Global error handler ────────────────────────────────────────────
	// Catches every unhandled error and wraps it in the RFC7807-compatible
	// envelope so clients always receive a predictable error shape.
	.onError(({ code, error, set, request }) => {
		elysiaLogger.error(
			{ err: error, code, path: request.url },
			"Unhandled error",
		);

		// Validation errors from Elysia's schema validation
		if (code === "VALIDATION") {
			const { code: status, message } = getStatusCode(422);
			set.status = status as number;
			const envelope = formatErrorResponse({
				code: message,
				problem: {
					status: status as number,
					title: "Validation Error",
					type: "urn:problem-type:validation-error",
					detail: error.message,
				},
			});
			return new Response(JSON.stringify(envelope), {
				status: status as number,
				headers: { "Content-Type": "application/problem+json" },
			});
		}

		// Responses thrown by auth guards are already formatted — pass them through
		if (error instanceof Response) {
			return error;
		}

		// Everything else is a 500
		const { code: status, message } = getStatusCode(500);
		set.status = status as number;
		const envelope = formatErrorResponse({
			code: message,
			problem: {
				status: status as number,
				title: "Internal Server Error",
				type: "urn:problem-type:internal-error",
				detail:
					process.env.NODE_ENV === "production"
						? undefined
						: (error as Error).message,
			},
		});
		return new Response(JSON.stringify(envelope), {
			status: status as number,
			headers: { "Content-Type": "application/problem+json" },
		});
	})
	.listen(PORT, () => {
		elysiaLogger.info(`🚀 API Server running at http://localhost:${PORT}/api`);
	});

export type App = typeof app;
