import { type Static, t } from "elysia";

/** ------------------------------------------
 * Links (HATEOAS-lite)
 * ------------------------------------------ */

export const LinkMapSchema = t.Object(
	{
		self: t.Optional(t.String()),
		next: t.Optional(t.String()),
		prev: t.Optional(t.String()),
		first: t.Optional(t.String()),
		last: t.Optional(t.String()),
	},
	{ additionalProperties: false },
);
export type LinkMap = Static<typeof LinkMapSchema>;
