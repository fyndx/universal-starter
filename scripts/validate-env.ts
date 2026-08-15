#!/usr/bin/env bun

/**
 * scripts/validate-env.ts
 *
 * Validates all environment variables required across the monorepo against
 * a Zod schema. Run this before starting any service to fail fast with a
 * clear message instead of a cryptic runtime error.
 *
 * Usage:
 *   bun run scripts/validate-env.ts
 *   node_modules/.bin/ts-node scripts/validate-env.ts
 *
 * Exit codes:
 *   0 – all variables present and valid
 *   1 – one or more variables missing or invalid
 */

import { z } from "zod";

// ── Shared schema ────────────────────────────────────────────────────────────

const sharedSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

// ── Package schemas ───────────────────────────────────────────────────────────

const dbSchema = sharedSchema.extend({
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const redisSchema = z.object({
	REDIS_URL: z.string().url("REDIS_URL must be a valid URL"),
});

const loggerSchema = sharedSchema.extend({
	LOG_LEVEL: z
		.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
		.default("info"),
});

// ── API schema ───────────────────────────────────────────────────────────────

const apiSchema = dbSchema
	.merge(redisSchema)
	.merge(loggerSchema)
	.extend({
		// Auth / better-auth
		BETTER_AUTH_SECRET: z
			.string()
			.min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
		BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),
		// Database
		DATABASE_URL: z.string().min(1),
		// Redis
		REDIS_URL: z.string().url(),
		// Email
		EMAIL_PROVIDER: z.enum(["resend", "nodemailer", "plunk"]).optional(),
		EMAIL_FROM: z.string().email().optional(),
		EMAIL_FROM_NAME: z.string().optional(),
		RESEND_API_KEY: z.string().optional(),
		NODEMAILER_USER: z.string().optional(),
		NODEMAILER_PASS: z.string().optional(),
		NODEMAILER_SERVICE: z.string().optional(),
		PLUNK_API_KEY: z.string().optional(),
		// Observability (optional)
		AXIOM_TOKEN: z.string().optional(),
		AXIOM_DOMAIN: z.string().optional(),
		DATASET_NAME: z.string().optional(),
		// SMTP (nodemailer)
		SMTP_USER: z.string().optional(),
		SMTP_PASS: z.string().optional(),
		SMTP_HOST: z.string().optional(),
		SMTP_PORT: z.string().optional(),
		SMTP_SECURE: z.string().optional(),
	});

// ── Web schema ───────────────────────────────────────────────────────────────

const webSchema = z.object({
	NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000/api"),
	NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3007"),
});

// ── Validation ────────────────────────────────────────────────────────────────

type ParseResult =
	| { ok: true; env: Record<string, string | undefined> }
	| { ok: false; errors: Record<string, string[]> };

function parse(
	schema: z.ZodSchema,
	prefix = "",
	env = process.env as Record<string, string | undefined>,
): ParseResult {
	const result = schema.safeParse(env);
	if (result.success) return { ok: true, env: result.data };
	const errors: Record<string, string[]> = {};
	for (const issue of z.flattenError(result.error).fieldErrors) {
		const key = prefix
			? `${prefix}.${issue.path.join(".")}`
			: issue.path.join(".");
		errors[key] = issue.messages;
	}
	return { ok: false, errors };
}

function section(name: string, schema: z.ZodSchema, env = process.env) {
	const result = parse(schema, name, env as Record<string, string | undefined>);
	if (result.ok) {
		console.log(`  ${name.padEnd(14)} ✓`);
	} else {
		console.error(`  ${name.padEnd(14)} ✗`);
		for (const [key, msgs] of Object.entries(result.errors)) {
			console.error(`    ${key}: ${msgs.join(", ")}`);
		}
	}
	return result.ok;
}

const schemas: Array<{ name: string; schema: z.ZodSchema }> = [
	{ name: "api", schema: apiSchema },
	{ name: "web", schema: webSchema },
	{ name: "db", schema: dbSchema },
	{ name: "redis", schema: redisSchema },
	{ name: "logger", schema: loggerSchema },
];

console.log("\n🔍 Validating environment variables…\n");

let allOk = true;
for (const { name, schema } of schemas) {
	if (!section(name, schema)) allOk = false;
}

console.log("");
if (allOk) {
	console.log("✅ All environment variables are valid.\n");
	process.exit(0);
} else {
	console.error(
		"❌ Environment validation failed. Fix the errors above and re-run.\n",
	);
	process.exit(1);
}
