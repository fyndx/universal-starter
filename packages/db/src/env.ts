import { z } from "zod";

/**
 * Environment variable schema for @universal/db.
 *
 * DATABASE_URL is required — without it the Prisma client cannot connect and
 * every query would fail with a cryptic adapter error. Validating upfront gives
 * a clear, actionable message at startup.
 *
 * NODE_ENV drives Prisma logging verbosity and the global-for-prisma cache.
 * It defaults to `development` so the package is usable in ad-hoc scripts
 * without setting NODE_ENV explicitly.
 */
export const envSchema = z.object({
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	throw new Error(
		`[@universal/db] Invalid environment variables: ${JSON.stringify(
			z.flattenError(parsed.error).fieldErrors,
		)}`,
	);
}

export const env = parsed.data;
