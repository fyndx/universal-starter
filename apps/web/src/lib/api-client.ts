import { treaty } from "@elysiajs/eden";
import type { App } from "@universal/api/types";
import { env } from "@/lib/env";

/**
 * Typed Eden treaty client for the Elysia backend.
 *
 * `App` is the `typeof app` type exported (type-only) from the api package's
 * `types` entry — see `apps/api/src/types.ts`. Importing it as a type keeps the
 * server's runtime code out of the web bundle while giving the treaty client
 * full end-to-end inference for every route.
 */
export const apiClient = treaty<App>(env.NEXT_PUBLIC_API_URL);
