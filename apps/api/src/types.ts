/**
 * Type-only export of the Elysia App type.
 *
 * This file exists so consumers (e.g. the web app's Eden treaty client) can
 * import `App` as a type without dragging the API's `@src/*` path aliases and
 * runtime modules into their build. It re-exports `typeof app` using
 * `import type` so it is fully erased at compile time.
 *
 * Usage on the consumer side:
 *   import type { App } from "@universal/api/types";
 *   import { treaty } from "@elysiajs/eden";
 *   const api = treaty<App>("http://localhost:3000");
 */

export type { App } from "./index.js";
