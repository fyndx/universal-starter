import { z } from "zod";

const envSchema = z.object({
	NEXT_PUBLIC_API_URL: z.url(),
});

function loadEnv() {
	// `process.env.NEXT_PUBLIC_*` is inlined at build time for client bundles.
	const value = process.env.NEXT_PUBLIC_API_URL;
	const parsed = envSchema.safeParse({ NEXT_PUBLIC_API_URL: value });
	if (!parsed.success) {
		// Keep the app usable in dev when the env var is missing; surface a clear
		// error in the console rather than crashing the render.
		console.error(
			"[web] Invalid or missing NEXT_PUBLIC_API_URL. Authentication and API calls will fail.",
			parsed.error.flatten().fieldErrors,
		);
		return { NEXT_PUBLIC_API_URL: "http://localhost:3000" };
	}
	return parsed.data;
}

export const env = loadEnv();
