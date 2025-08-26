import { type Static, t } from "elysia";

/** ------------------------------------------
 * Meta (observability, versioning, etc.)
 * ------------------------------------------ */

export const MetaSchema = t.Object(
	{
		requestId: t.String(),
		schemaVersion: t.String(), // e.g. '1.0'
		generatedAt: t.String({ format: "date-time" }),
		traceId: t.Optional(t.String()),
		spanId: t.Optional(t.String()),
		locale: t.Optional(t.String()),
		etag: t.Optional(t.String()),
		idempotencyKey: t.Optional(t.String()),
	},
	{ additionalProperties: true },
);
export type Meta = Static<typeof MetaSchema>;
