import { z } from "zod";

/**
 * Environment variable schema for @universal/redis.
 *
 * REDIS_URL is required — without it ioredis cannot connect. Validating upfront
 * gives a clear, actionable message instead of a runtime `TypeError: Connection
   is undefined` deep inside ioredis.
 */
export const envSchema = z.object({
	REDIS_URL: z.url("REDIS_URL must be a valid URL"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	throw new Error(
		`[@universal/redis] Invalid environment variables: ${JSON.stringify(
			z.flattenError(parsed.error).fieldErrors,
		)}`,
	);
}

export const env = parsed.data;
