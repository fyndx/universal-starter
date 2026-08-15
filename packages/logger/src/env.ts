import { z } from "zod";

/**
 * Environment variable schema for @universal/logger.
 *
 * LOG_LEVEL is optional and defaults to `info`. When set, it must be one of
 * pino's recognised levels — an invalid value fails fast with a clear message
 * instead of silently falling back.
 */
export const envSchema = z.object({
	LOG_LEVEL: z
		.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
		.default("info"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	throw new Error(
		`[@universal/logger] Invalid environment variables: ${JSON.stringify(
			z.flattenError(parsed.error).fieldErrors,
		)}`,
	);
}

export const env = parsed.data;
