import { describe, expect, it } from "bun:test";
import { envSchema } from "./env";

describe("@universal/db env schema", () => {
	it("accepts a valid DATABASE_URL and defaults NODE_ENV", () => {
		const result = envSchema.safeParse({
			DATABASE_URL: "postgresql://localhost:5432/test",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.NODE_ENV).toBe("development");
		}
	});

	it("rejects an empty DATABASE_URL", () => {
		const result = envSchema.safeParse({ DATABASE_URL: "" });
		expect(result.success).toBe(false);
	});

	it("rejects a missing DATABASE_URL", () => {
		const result = envSchema.safeParse({});
		expect(result.success).toBe(false);
	});

	it("accepts all valid NODE_ENV values", () => {
		for (const env of ["development", "production", "test"]) {
			const result = envSchema.safeParse({
				DATABASE_URL: "postgresql://localhost:5432/test",
				NODE_ENV: env,
			});
			expect(result.success).toBe(true);
		}
	});

	it("rejects an invalid NODE_ENV", () => {
		const result = envSchema.safeParse({
			DATABASE_URL: "postgresql://localhost:5432/test",
			NODE_ENV: "staging",
		});
		expect(result.success).toBe(false);
	});
});
