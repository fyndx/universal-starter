/** ------------------------------------------
 * Utilities: formatSuccessResponse / formatErrorResponse
 * ------------------------------------------ */

import type {
	EnvelopeError,
	EnvelopeSuccess,
} from "../schemas/api-spec/envelope";
import type { LinkMap } from "../schemas/api-spec/links";
import type { Meta } from "../schemas/api-spec/meta-data";
import type { Problem } from "../schemas/api-spec/problem";
import type { UI } from "../schemas/api-spec/ui";

export type SuccessOptions = {
	links?: LinkMap;
	ui?: UI;
	meta?: Partial<Meta>;
	schemaVersion?: string; // default '1.0'
	requestId?: string; // override
	traceId?: string;
	spanId?: string;
	locale?: string;
	etag?: string;
	idempotencyKey?: string;
	now?: () => string; // inject clock in tests
	generateRequestId?: () => string; // inject RNG in tests
};

export type ErrorOptions = Omit<SuccessOptions, "etag"> & {
	problemInstance?: string;
};

const defaultNow = () => new Date().toISOString();
const defaultId = () =>
	globalThis.crypto?.randomUUID?.() ??
	`req_${Math.random().toString(36).slice(2, 10)}`;

function buildMeta(opts: SuccessOptions | ErrorOptions): Meta {
	const reqId = opts.requestId ?? (opts.generateRequestId ?? defaultId)();
	const generatedAt = (opts.now ?? defaultNow)();
	return {
		requestId: reqId,
		schemaVersion: opts.schemaVersion ?? "1.0",
		generatedAt,
		...(opts.traceId ? { traceId: opts.traceId } : {}),
		...(opts.spanId ? { spanId: opts.spanId } : {}),
		...(opts.locale ? { locale: opts.locale } : {}),
		...(opts.idempotencyKey ? { idempotencyKey: opts.idempotencyKey } : {}),
		...("etag" in opts && (opts as SuccessOptions).etag
			? { etag: (opts as SuccessOptions).etag }
			: {}),
		...(opts.meta ?? {}),
	};
}

interface FormatSuccessParams<D> {
	code: string;
	data: D;
	options?: SuccessOptions;
}

/**
 * formatSuccessResponse — builds an EnvelopeSuccess<D>
 */
export function formatSuccessResponse<D>({
	code,
	data,
	options = {},
}: FormatSuccessParams<D>): EnvelopeSuccess<D> {
	const meta = buildMeta(options);
	const envelope: EnvelopeSuccess<D> = {
		ok: true,
		code,
		data,
		error: null,
		...(options.links ? { links: options.links } : {}),
		...(options.ui ? { ui: options.ui } : {}),
		meta,
	};
	return envelope;
}

/**
 * formatErrorResponse — builds an EnvelopeError from an RFC7807-like problem.
 * Ensures problem.code mirrors envelope code, and problem.instance mirrors meta.requestId.
 */
export type ProblemInput = Pick<Problem, "type" | "title" | "status"> &
	Partial<
		Pick<
			Problem,
			| "detail"
			| "errors"
			| "hint"
			| "docsUrl"
			| "supportUrl"
			| "retryAfterSeconds"
		>
	>;

interface FormatErrorParams {
	code: string;
	problem: ProblemInput;
	options?: ErrorOptions;
}

export function formatErrorResponse({
	code,
	problem,
	options = {},
}: FormatErrorParams): EnvelopeError {
	const meta = buildMeta(options);
	const mergedProblem: Problem = {
		...problem,
		code: problem.code ?? code,
		instance: problem.instance ?? meta.requestId,
	} as Problem;

	const envelope: EnvelopeError = {
		ok: false,
		code,
		data: null,
		error: mergedProblem,
		...(options.links ? { links: options.links } : {}),
		...(options.ui ? { ui: options.ui } : {}),
		meta,
	};
	return envelope;
}
