import { describe, expect, it } from "bun:test";

// REDIS_URL is required at module load (env.ts validates process.env).
// The root .env provides it at test time; if absent we set a fallback so
// the module-level safeParse does not throw before tests can run.
process.env.REDIS_URL ??= "http://dummy.local:9999";

// Dynamic import so the env var is set before env.ts runs its safeParse.
const { envSchema } = await import("./env");

describe("@universal/redis env schema", () => {
	it("accepts a valid URL", () => {
		const result = envSchema.safeParse({
			REDIS_URL: "http://example.com:6380",
		});
		expect(result.success).toBe(true);
	});

	it("rejects a missing REDIS_URL", () => {
		const result = envSchema.safeParse({});
		expect(result.success).toBe(false);
	});

	it("rejects an empty REDIS_URL", () => {
		const result = envSchema.safeParse({ REDIS_URL: "" });
		expect(result.success).toBe(false);
	});

	it("rejects a non-URL string", () => {
		const result = envSchema.safeParse({ REDIS_URL: "not-a-url" });
		expect(result.success).toBe(false);
	});
});
