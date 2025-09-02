import { type Static, t } from "elysia";
import { ProblemSchema } from "./problem";

/** ------------------------------------------
 * Long-running operation (LRO) resource
 * ------------------------------------------ */
// TODO: Improve this schema
// https://github.com/fyndx/universal-starter/pull/13#discussion_r2300996939
export const OperationSchema = t.Object(
	{
		name: t.String(),
		done: t.Boolean(),
		metadata: t.Optional(t.Record(t.String(), t.Unknown())),
		response: t.Optional(t.Record(t.String(), t.Unknown())),
		error: t.Optional(ProblemSchema),
	},
	{ additionalProperties: false },
);
export type Operation = Static<typeof OperationSchema>;
