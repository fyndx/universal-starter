import { type Static, t } from "elysia";

/** ------------------------------------------
 * Meta (observability, versioning, etc.)
 * ------------------------------------------ */

export const MetaSchema = t.Object(
	{
		requestId: t.String({ minLength: 1, readOnly: true }),
		schemaVersion: t.String({
			pattern: "^[0-9]+\\.[0-9]+(\\.[0-9]+)?$",
			readOnly: true,
		}),
		generatedAt: t.String({ format: "date-time", readOnly: true }),
		// OpenTelemetry hex IDs: 32-char traceId, 16-char spanId
		traceId: t.Optional(t.String({ pattern: "^[0-9a-f]{32}$" })),
		spanId: t.Optional(t.String({ pattern: "^[0-9a-f]{16}$" })),
		// BCP 47 locale tags (simplified)
		locale: t.Optional(
			t.String({ pattern: "^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$" }),
		),
		// ETag (weak or strong) – relaxed pattern to avoid over-rejection
		etag: t.Optional(t.String({ minLength: 1 })),
		idempotencyKey: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
	},
	{ additionalProperties: true },
);
export type Meta = Static<typeof MetaSchema>;
