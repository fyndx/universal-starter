import { type Static, type TSchema, t } from "elysia";
import { LinkMapSchema } from "./api-spec/links";
import { MetaSchema } from "./api-spec/meta-data";
import { ProblemFieldIssueSchema } from "./api-spec/problem";
import { UISchema } from "./api-spec/ui";

/** ------------------------------------------
 * Common Schema Definitions
 * ------------------------------------------ */

/**
 * Schema for URI-formatted strings (e.g., "https://example.com/path")
 * Used for type, docsUrl, supportUrl fields in Problem objects
 */
const UriStringSchema = t.String({ format: "uri" });

/**
 * Schema for optional string values
 * Used as a reusable pattern for optional string fields
 */
const OptionalStringSchema = t.Optional(t.String());

/** ------------------------------------------
 * Base Options Schema (shared fields)
 * ------------------------------------------ */

/**
 * BaseOptionsSchema - Common fields shared between SuccessOptions and ErrorOptions
 */
const BaseOptionsSchema = t.Object({
  /**
   * HATEOAS-style links for navigation (self, next, prev, first, last)
   * Useful for pagination and resource discovery
   */
  links: t.Optional(LinkMapSchema),

  /**
   * UI metadata for frontend rendering (severity, presentation, actions)
   * Allows backend to drive UI behavior (toasts, banners, dialogs, etc.)
   */
  ui: t.Optional(UISchema),

  /**
   * Partial metadata object that will be merged with generated meta fields
   * Can override or extend default meta properties
   */
  meta: t.Optional(t.Partial(MetaSchema)),

  /**
   * API schema version (e.g., "1.0", "2.1")
   * Defaults to "1.0" if not provided
   * Used for API versioning and client compatibility checks
   */
  schemaVersion: OptionalStringSchema,

  /**
   * Unique identifier for this request
   * Auto-generated if not provided (UUID or random string)
   * Used for request tracing and debugging
   */
  requestId: OptionalStringSchema,

  /**
   * OpenTelemetry trace ID (32-character hex string)
   * Used for distributed tracing across services
   * Format: ^[0-9a-f]{32}$
   */
  traceId: OptionalStringSchema,

  /**
   * OpenTelemetry span ID (16-character hex string)
   * Identifies a specific span within a trace
   * Format: ^[0-9a-f]{16}$
   */
  spanId: OptionalStringSchema,

  /**
   * BCP 47 locale tag (e.g., "en-US", "fr-CA")
   * Indicates the preferred language/region for the response
   * Used for internationalization
   */
  locale: OptionalStringSchema,

  /**
   * Idempotency key for safe request retries
   * Client-provided unique key to prevent duplicate operations
   * Max length: 255 characters
   */
  idempotencyKey: OptionalStringSchema,
});

/** ------------------------------------------
 * Response Options Schemas
 * ------------------------------------------ */

/**
 * SuccessOptionsSchema - Options for formatting success responses
 * Extends BaseOptionsSchema with etag field
 * Note: Functions (now, generateRequestId) are not serializable in schemas
 * and should be handled separately in TypeScript types
 */
export const SuccessOptionsSchema = t.Composite([
  BaseOptionsSchema,
  t.Object({
    /**
     * Entity tag for HTTP caching (weak or strong)
     * Used for conditional requests (If-None-Match, If-Match headers)
     * Enables efficient cache validation and optimistic concurrency control
     */
    etag: OptionalStringSchema,
  }),
]);

export type SuccessOptions = Static<typeof SuccessOptionsSchema> & {
  /**
   * Function to generate current timestamp (ISO 8601 format)
   * Used for testing: allows injecting a mock clock
   * Defaults to Date.now().toISOString()
   */
  now?: () => string;

  /**
   * Function to generate unique request IDs
   * Used for testing: allows injecting deterministic ID generation
   * Defaults to crypto.randomUUID() or random string fallback
   */
  generateRequestId?: () => string;
};

/**
 * ErrorOptionsSchema - Options for formatting error responses
 * Extends BaseOptionsSchema with problemInstance field (omits etag)
 */
export const ErrorOptionsSchema = t.Composite([
  BaseOptionsSchema,
  t.Object({
    /**
     * URI reference that identifies the specific occurrence of the problem
     * Typically set to the request path or a unique error instance identifier
     * Used in RFC7807 Problem Details for error tracking
     */
    problemInstance: OptionalStringSchema,
  }),
]);

export type ErrorOptions = Static<typeof ErrorOptionsSchema> & {
  /**
   * Function to generate current timestamp (ISO 8601 format)
   * Used for testing: allows injecting a mock clock
   * Defaults to Date.now().toISOString()
   */
  now?: () => string;

  /**
   * Function to generate unique request IDs
   * Used for testing: allows injecting deterministic ID generation
   * Defaults to crypto.randomUUID() or random string fallback
   */
  generateRequestId?: () => string;
};

/** ------------------------------------------
 * Problem Input Schema
 * ------------------------------------------ */

/**
 * ProblemInputSchema - Input for creating Problem objects (RFC7807-compatible)
 * Required: type, title, status
 * Optional: detail, errors, hint, docsUrl, supportUrl, retryAfterSeconds
 * Reuses ProblemFieldIssueSchema from problem.ts for errors array
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7807
 */
export const ProblemInputSchema = t.Object({
  /**
   * URI reference that identifies the problem type
   * Should be a stable, unique identifier for this error type
   * Example: "https://api.example.com/problems/validation-error"
   * Required field per RFC7807
   */
  type: UriStringSchema,

  /**
   * Short, human-readable summary of the problem
   * Should be the same for every occurrence of the same problem type
   * Example: "Validation Error"
   * Required field per RFC7807
   */
  title: t.String(),

  /**
   * HTTP status code for this occurrence of the problem
   * Should match the actual HTTP status code in the response
   * Example: 400, 404, 500
   * Required field per RFC7807
   */
  status: t.Integer(),

  /**
   * Human-readable explanation specific to this occurrence of the problem
   * Provides more context than the title
   * Example: "The 'email' field must be a valid email address"
   */
  detail: OptionalStringSchema,

  /**
   * URI reference that identifies the specific occurrence of the problem
   * Typically the request path or a unique error instance identifier
   * Example: "/api/users/123" or "error-instance-abc123"
   */
  instance: OptionalStringSchema,

  /**
   * Machine-readable error code (alphanumeric identifier)
   * Used for programmatic error handling
   * Example: "VALIDATION_ERROR", "NOT_FOUND", "INTERNAL_ERROR"
   * Mirrors the envelope code field
   */
  code: OptionalStringSchema,

  /**
   * Array of field-specific validation errors
   * Each error includes: path (JSON pointer), reason, and optional message
   * Used for form validation and field-level error reporting
   * Example: [{ path: "/email", reason: "invalid_format", message: "Must be a valid email" }]
   */
  errors: t.Optional(t.Array(ProblemFieldIssueSchema)),

  /**
   * Human-readable suggestion for resolving the problem
   * Provides actionable guidance to the client
   * Example: "Ensure the email field contains a valid email address"
   */
  hint: OptionalStringSchema,

  /**
   * URI pointing to human-readable documentation for this problem type
   * Helps developers understand and resolve the issue
   * Example: "https://docs.example.com/errors/validation-error"
   */
  docsUrl: t.Optional(UriStringSchema),

  /**
   * URI pointing to support resources or contact information
   * Useful when the client needs additional help
   * Example: "https://support.example.com/contact"
   */
  supportUrl: t.Optional(UriStringSchema),

  /**
   * Number of seconds after which the client should retry the request
   * Used for rate limiting and temporary failures (503 Service Unavailable)
   * Must be a non-negative integer
   * Example: 60 (retry after 1 minute)
   */
  retryAfterSeconds: t.Optional(t.Integer({ minimum: 0 })),
});

export type ProblemInput = Static<typeof ProblemInputSchema>;

/** ------------------------------------------
 * Format Function Parameter Schemas
 * ------------------------------------------ */

/**
 * Schema for machine-readable response codes
 * Used to identify the type of response or operation
 * Example: "USER_CREATED", "LIST_RETRIEVED", "VALIDATION_ERROR"
 */
const CodeStringSchema = t.String();

/**
 * FormatSuccessParamsSchema - Parameters for formatSuccessResponse
 * Note: Generic data type cannot be represented in schema, use TypeScript type
 */
export const FormatSuccessParamsSchema = <D extends TSchema>(dataSchema: D) =>
  t.Object({
    /**
     * Machine-readable code identifying the success response type
     * Example: "USER_CREATED", "LIST_RETRIEVED", "OPERATION_SUCCESS"
     */
    code: CodeStringSchema,

    /**
     * The actual response data payload
     * Type is determined by the generic dataSchema parameter
     * Can be any valid TypeBox schema (object, array, primitive, etc.)
     */
    data: dataSchema,

    /**
     * Optional configuration for response formatting
     * Includes links, UI metadata, tracing info, caching headers, etc.
     */
    options: t.Optional(SuccessOptionsSchema),
  });

/**
 * FormatErrorParamsSchema - Parameters for formatErrorResponse
 */
export const FormatErrorParamsSchema = t.Object({
  /**
   * Machine-readable code identifying the error type
   * Example: "VALIDATION_ERROR", "NOT_FOUND", "INTERNAL_ERROR"
   * This code will be mirrored in the problem.code field
   */
  code: CodeStringSchema,

  /**
   * RFC7807-compatible problem details object
   * Contains type, title, status, and optional error details
   * The problem.instance will default to meta.requestId if not provided
   */
  problem: ProblemInputSchema,

  /**
   * Optional configuration for error response formatting
   * Includes links, UI metadata, tracing info, etc.
   * Note: etag is not available for error responses
   */
  options: t.Optional(ErrorOptionsSchema),
});

export type FormatErrorParams = Static<typeof FormatErrorParamsSchema> & {
  options?: ErrorOptions;
};

/** ------------------------------------------
 * Re-export Envelope Types
 * ------------------------------------------ */

export type {
  EnvelopeError,
  EnvelopeSuccess,
} from "./api-spec/envelope";
