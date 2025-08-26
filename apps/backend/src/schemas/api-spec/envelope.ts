import { Value } from "@sinclair/typebox/value";
import { type TSchema, t } from "elysia";
import { type LinkMap, LinkMapSchema } from "./links";
import { type Meta, MetaSchema } from "./meta-data";
import { PageSchema } from "./pagination";
import { type Problem, ProblemSchema } from "./problem";
import { type UI, UISchema } from "./ui";

/** ------------------------------------------
 * Envelope (generic maker) — envelope always
 * ------------------------------------------ */

// Success envelope: error is explicitly null
export const makeSuccessEnvelopeSchema = <D extends TSchema>(dataSchema: D) =>
	t.Object(
		{
			ok: t.Literal(true),
			code: t.String(),
			data: dataSchema,
			error: t.Null(),
			links: t.Optional(LinkMapSchema),
			ui: t.Optional(UISchema),
			meta: MetaSchema,
		},
		{ additionalProperties: false },
	);

// Error envelope: data is explicitly null
export const makeErrorEnvelopeSchema = () =>
	t.Object(
		{
			ok: t.Literal(false),
			code: t.String(),
			data: t.Null(),
			error: ProblemSchema,
			links: t.Optional(LinkMapSchema),
			ui: t.Optional(UISchema),
			meta: MetaSchema,
		},
		{ additionalProperties: false },
	);

// Generic union (useful for runtime guards)
export const SuccessEnvelopeUnknownSchema = makeSuccessEnvelopeSchema(
	t.Unknown(),
);
export const ErrorEnvelopeSchema = makeErrorEnvelopeSchema();
export const EnvelopeUnknownSchema = t.Union([
	SuccessEnvelopeUnknownSchema,
	ErrorEnvelopeSchema,
]);

export type EnvelopeSuccess<D> = {
	ok: true;
	code: string;
	data: D;
	error: null;
	links?: LinkMap;
	ui?: UI;
	meta: Meta;
};

export type EnvelopeError = {
	ok: false;
	code: string;
	data: null;
	error: Problem;
	links?: LinkMap;
	ui?: UI;
	meta: Meta;
};

export type Envelope<D = unknown> = EnvelopeSuccess<D> | EnvelopeError;

/** ------------------------------------------
 * List data helpers (items + page)
 * ------------------------------------------ */

export const makeListDataSchema = <Item extends TSchema>(itemSchema: Item) =>
	t.Object(
		{
			items: t.Array(itemSchema),
			page: PageSchema,
		},
		{ additionalProperties: false },
	);

/** ------------------------------------------
 * Bulk operation helpers (partial success)
 * ------------------------------------------ */

export const makeBulkResultSchema = <SuccessItem extends TSchema>(
	successItemSchema: SuccessItem,
) =>
	t.Object(
		{
			successes: t.Array(
				t.Object(
					{
						index: t.Integer({ minimum: 0 }),
						// Attach your domain fields for a success item
						// TODO: just use successItemSchema https://github.com/fyndx/universal-starter/pull/13#discussion_r2300996906
						...("properties" in successItemSchema
							? (successItemSchema as any).properties
							: { value: successItemSchema }),
					},
					{ additionalProperties: true },
				),
			),
			failures: t.Array(
				t.Object(
					{
						index: t.Integer({ minimum: 0 }),
						error: ProblemSchema,
					},
					{ additionalProperties: false },
				),
			),
		},
		{ additionalProperties: false },
	);

/** ------------------------------------------
 * Optional: Runtime guards using TypeBox
 * ------------------------------------------ */

export function isEnvelopeUnknown(value: unknown): value is Envelope {
	return Value.Check(EnvelopeUnknownSchema, value);
}

export function assertEnvelopeUnknown(
	value: unknown,
): asserts value is Envelope {
	if (!isEnvelopeUnknown(value)) {
		const errors = [...Value.Errors(EnvelopeUnknownSchema, value)].map(
			(e) => `${e.path}: ${e.message}`,
		);
		throw new Error(`Invalid envelope:\n${errors.join("\n")}`);
	}
}
