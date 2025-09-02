import { type Static, t } from "elysia";

/** ------------------------------------------
 * Pagination (cursor | offset)
 * ------------------------------------------ */

export const PageCursorSchema = t.Object(
	{
		mode: t.Literal("cursor"),
		cursor: t.String(),
		nextCursor: t.Union([t.String(), t.Null()]),
		size: t.Integer({ minimum: 1 }),
	},
	{ additionalProperties: false },
);

export const PageOffsetSchema = t.Object(
	{
		mode: t.Literal("offset"),
		offset: t.Integer({ minimum: 0 }),
		limit: t.Integer({ minimum: 1 }),
		hasMore: t.Boolean(),
	},
	{ additionalProperties: false },
);

export const PageSchema = t.Union([PageCursorSchema, PageOffsetSchema]);
export type Page = Static<typeof PageSchema>;
export type PageCursor = Static<typeof PageCursorSchema>;
export type PageOffset = Static<typeof PageOffsetSchema>;
