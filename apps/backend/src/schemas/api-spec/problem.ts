import { type Static, t } from "elysia";

/** ------------------------------------------
 * Problem (RFC7807-compatible) for errors
 * ------------------------------------------ */
// TODO: Add json pointer on client
// https://www.npmjs.com/package/@jsonjoy.com/json-pointer
export const ProblemFieldIssueSchema = t.Object(
	{
		path: t.String({ format: "json-pointer" }),
		reason: t.String(),
		message: t.Optional(t.String()),
	},
	{ additionalProperties: true },
);

export const ProblemSchema = t.Object(
	{
		type: t.String({ format: "uri" }),
		title: t.String(),
		status: t.Integer(),
		detail: t.Optional(t.String()),
		instance: t.Optional(t.String()),
		code: t.Optional(t.String()), // machine code (mirrors envelope code)
		errors: t.Optional(t.Array(ProblemFieldIssueSchema)),
		hint: t.Optional(t.String()),
		docsUrl: t.Optional(t.String({ format: "uri" })),
		supportUrl: t.Optional(t.String({ format: "uri" })),
		retryAfterSeconds: t.Optional(t.Integer({ minimum: 0 })),
	},
	{ additionalProperties: true },
);
export type Problem = Static<typeof ProblemSchema>;
