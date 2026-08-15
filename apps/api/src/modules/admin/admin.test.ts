import { beforeAll, beforeEach, describe, expect, it, mock } from "bun:test";
import { Elysia } from "elysia";

/**
 * RBAC enforcement for the admin route group.
 *
 * `@src/lib/auth` is mocked so `auth.api.getSession` returns a controllable
 * session, letting us exercise all three branches — no session (401),
 * authenticated non-admin (403), authenticated admin (200) — without a
 * database or a real better-auth instance.
 */
type MockSession = {
	user: { id: string; email: string; role: string };
	session: { id: string };
};

let currentSession: MockSession | null = null;
// `adminRoutes()` decorates the Elysia instance with the better-auth `auth`
// decorator, producing a more specific type than bare `Elysia` — declaring
// `app` as `Elysia` causes a decorator-invariance error. The test only calls
// `.handle()`, so a structural type with just that method is sufficient and
// keeps the assertion clean.
let app!: { handle: (req: Request) => Promise<Response> };

beforeAll(async () => {
	await mock.module("@src/lib/auth", () => ({
		auth: { api: { getSession: async () => currentSession } },
	}));
	const { adminRoutes } = await import("./index");
	app = new Elysia()
		// Mirrors the production global error handler: thrown `Response` objects
		// (the 401/403 envelopes from the guards) pass through unchanged.
		.onError(({ error }) => {
			if (error instanceof Response) return error;
			throw error;
		})
		.use(adminRoutes());
});

beforeEach(() => {
	currentSession = null;
});

const request = () => app.handle(new Request("http://localhost/admin/stats"));

describe("admin route group — RBAC", () => {
	it("rejects unauthenticated requests with 401", async () => {
		currentSession = null;
		const res = await request();
		expect(res.status).toBe(401);
		expect(res.headers.get("content-type")).toContain(
			"application/problem+json",
		);
	});

	it("rejects authenticated non-admin users with 403", async () => {
		currentSession = {
			user: { id: "u_1", email: "user@example.com", role: "user" },
			session: { id: "s_1" },
		};
		const res = await request();
		expect(res.status).toBe(403);
		expect(res.headers.get("content-type")).toContain(
			"application/problem+json",
		);
	});

	it("allows authenticated admin users with 200", async () => {
		currentSession = {
			user: { id: "u_admin", email: "admin@example.com", role: "admin" },
			session: { id: "s_admin" },
		};
		const res = await request();
		expect(res.status).toBe(200);
		const body = (await res.json()) as {
			ok: boolean;
			code: string;
			data: { adminUser: { role: string } };
		};
		expect(body.ok).toBe(true);
		expect(body.code).toBe("ADMIN_STATS");
		expect(body.data.adminUser.role).toBe("admin");
	});
});
