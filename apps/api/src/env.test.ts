import { describe, expect, it } from "bun:test";
import { envSchema } from "./env";

describe("Environment Variables Schema", () => {
	const validBaseConfig = {
		DATABASE_URL: "postgresql://localhost:5432/mydb",
		BETTER_AUTH_SECRET: "secret",
		BETTER_AUTH_URL: "http://localhost:3000",
		EMAIL_PROVIDER: "smtp",
		EMAIL_FROM: "test@example.com",
		EMAIL_FROM_NAME: "Test",
		REDIS_URL: "redis://localhost:6379",
		NODE_ENV: "test",
	};

	it("should validate when no social providers are set", () => {
		const result = envSchema.safeParse(validBaseConfig);
		expect(result.success).toBe(true);
	});

	it("should validate when Google is fully configured", () => {
		const config = {
			...validBaseConfig,
			GOOGLE_CLIENT_ID: "google-id",
			GOOGLE_CLIENT_SECRET: "google-secret",
		};
		const result = envSchema.safeParse(config);
		expect(result.success).toBe(true);
	});

	it("should fail when Google ID is present but Secret is missing", () => {
		const config = {
			...validBaseConfig,
			GOOGLE_CLIENT_ID: "google-id",
		};
		const result = envSchema.safeParse(config);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain(
				"Google requires both Client ID and Client Secret",
			);
		}
	});

	it("should fail when Google Secret is present but ID is missing", () => {
		const config = {
			...validBaseConfig,
			GOOGLE_CLIENT_SECRET: "google-secret",
		};
		const result = envSchema.safeParse(config);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain(
				"Google requires both Client ID and Client Secret",
			);
		}
	});

	it("should validate when multiple providers are correctly configured", () => {
		const config = {
			...validBaseConfig,
			GOOGLE_CLIENT_ID: "google-id",
			GOOGLE_CLIENT_SECRET: "google-secret",
			GITHUB_CLIENT_ID: "github-id",
			GITHUB_CLIENT_SECRET: "github-secret",
		};
		const result = envSchema.safeParse(config);
		expect(result.success).toBe(true);
	});

	it("should fail when one of multiple providers is incomplete", () => {
		const config = {
			...validBaseConfig,
			GOOGLE_CLIENT_ID: "google-id",
			GOOGLE_CLIENT_SECRET: "google-secret",
			GITHUB_CLIENT_ID: "github-id",
			// Missing GITHUB_CLIENT_SECRET
		};
		const result = envSchema.safeParse(config);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain(
				"GitHub requires both Client ID and Client Secret",
			);
		}
	});
});
