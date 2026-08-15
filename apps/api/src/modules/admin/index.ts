import { getStatusCode } from "@readme/http-status-codes";
import { withAuth } from "@src/plugins/auth";
import { requireAuth } from "@src/plugins/auth-guards";
import {
	makeErrorEnvelopeSchema,
	makeSuccessEnvelopeSchema,
} from "@src/schemas/api-spec";
import {
	formatErrorResponse,
	formatSuccessResponse,
} from "@src/utils/format-response";
import Elysia, { t } from "elysia";

/**
 * Admin route group — server-side RBAC.
 *
 * Every route here enforces BOTH authentication (401) and authorization (403):
 * `withAuth()` + `requireAuth()` provide the session derive and the 401 guard
 * (the same proven pattern `meRoutes` uses), and the inline `onBeforeHandle`
 * adds the 403 role check. The client-side guards in the web app are advisory
 * only and must never be the sole protection for privileged operations.
 *
 * Why not a reusable `requireRole(['admin'])` plugin? Elysia's scoped derive
 * types (`user`/`session` from `withAuth`) propagate through zero-arg plugin
 * factories like `requireAuth()` but are lost when the factory takes a parameter
 * (`requireRole(roles)`). Inlining the role check here keeps full type inference
 * for the route handler. See `auth-guards.ts` for the `requireRole` export,
 * which remains available for routes that don't need `user` in the handler.
 *
 * better-auth's own admin plugin endpoints (user management, bans, role changes,
 * impersonation) are mounted separately via `.mount(auth.handler)` and are
 * protected internally by the plugin, which requires the acting session to hold
 * the `admin` role. This group is for application-level admin routes that sit
 * outside better-auth's surface.
 */
const AdminStatsSchema = t.Object({
	serverTime: t.String({
		description: "ISO-8601 timestamp the response was generated",
	}),
	uptimeSeconds: t.Number({ description: "API process uptime, in seconds" }),
	nodeEnv: t.String({ description: "Current NODE_ENV value" }),
	adminUser: t.Object({
		id: t.String({ description: "Authenticated admin user id" }),
		email: t.String({
			format: "email",
			description: "Authenticated admin user email",
		}),
		role: t.String({ description: "Authenticated admin user role" }),
	}),
});

const ADMIN_ROLE = "admin";

export const adminRoutes = () =>
	new Elysia({ prefix: "/admin" })
		.use(withAuth())
		.use(requireAuth())
		// 403 role check — inline so the `user` derive (from `withAuth`) stays
		// type-inferred for the route handlers below.
		.onBeforeHandle({ as: "scoped" }, ({ user, set }) => {
			const role = user?.role;
			if (!role || role !== ADMIN_ROLE) {
				const { code: status, message } = getStatusCode(403);
				set.status = "Forbidden";
				const envelope = formatErrorResponse({
					code: message,
					problem: {
						status: status as number,
						title: "User is not authorized",
						type: "urn:problem-type:authorization-error",
					},
				});
				throw new Response(JSON.stringify(envelope), {
					status: status as number,
					headers: { "Content-Type": "application/problem+json" },
				});
			}
		})
		.get(
			"/stats",
			({ user }) => {
				// requireAuth + the 403 guard guarantee a session + admin role, but the
				// derive type is still nullable; guard for the type checker.
				if (!user) {
					throw new Error("User not found");
				}

				return formatSuccessResponse({
					code: "ADMIN_STATS",
					data: {
						serverTime: new Date().toISOString(),
						uptimeSeconds: Math.floor(process.uptime()),
						nodeEnv: process.env.NODE_ENV ?? "unknown",
						adminUser: {
							id: user.id,
							email: user.email,
							role: user.role ?? "unknown",
						},
					},
				});
			},
			{
				detail: {
					tags: ["Admin"],
					summary: "Admin-only server diagnostics",
					description:
						"Returns basic server diagnostics. Requires an authenticated admin session.",
				},
				response: {
					200: makeSuccessEnvelopeSchema(AdminStatsSchema),
					401: makeErrorEnvelopeSchema(),
					403: makeErrorEnvelopeSchema(),
				},
			},
		);
