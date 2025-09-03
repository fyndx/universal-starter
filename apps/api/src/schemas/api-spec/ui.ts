import { type Static, t } from "elysia";

/** ------------------------------------------
 * UI (backend-driven, optional, ignorable)
 * ------------------------------------------ */

export const UIActionLinkSchema = t.Object(
	{
		type: t.Literal("link"),
		label: t.String(),
		href: t.String(),
	},
	{ additionalProperties: false },
);

export const UIActionRouteSchema = t.Object(
	{
		type: t.Literal("route"),
		label: t.String(),
		route: t.String(),
		payload: t.Optional(t.Record(t.String(), t.Unknown())),
	},
	{ additionalProperties: false },
);

export const UIActionRetrySchema = t.Object(
	{
		type: t.Literal("retry"),
		label: t.String(),
	},
	{ additionalProperties: false },
);

export const UIActionCopySchema = t.Object(
	{
		type: t.Literal("copy"),
		label: t.String(),
		copyText: t.String(),
	},
	{ additionalProperties: false },
);

export const UIActionSupportSchema = t.Object(
	{
		type: t.Literal("support"),
		label: t.String(),
		payload: t.Optional(t.Record(t.String(), t.Unknown())),
	},
	{ additionalProperties: false },
);

export const UIActionSchema = t.Union([
	UIActionLinkSchema,
	UIActionRouteSchema,
	UIActionRetrySchema,
	UIActionCopySchema,
	UIActionSupportSchema,
]);

export const UISchema = t.Object(
	{
		messageKey: t.Optional(t.String()),
		messageFallback: t.Optional(t.String()),
		severity: t.Optional(
			t.Union([
				t.Literal("info"),
				t.Literal("success"),
				t.Literal("warning"),
				t.Literal("error"),
			]),
		),
		presentation: t.Optional(
			t.Union([
				t.Literal("toast"),
				t.Literal("banner"),
				t.Literal("dialog"),
				t.Literal("inline"),
			]),
		),
		actions: t.Optional(t.Array(UIActionSchema)),
	},
	{ additionalProperties: false },
);

export type UI = Static<typeof UISchema>;
export type UIAction = Static<typeof UIActionSchema>;
