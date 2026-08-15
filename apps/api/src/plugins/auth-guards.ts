import { getStatusCode } from "@readme/http-status-codes";
import Elysia from "elysia";
import { formatErrorResponse } from "../utils/format-response";
import { withAuth } from "./auth";

export const requireAuth = () =>
	new Elysia({ name: "requireAuth" })
		.use(withAuth())
		.onBeforeHandle({ as: "scoped" }, ({ session, user, set }) => {
			if (!(session && user)) {
				const { code: status, message } = getStatusCode(401);
				set.status = "Unauthorized";
				const envelope = formatErrorResponse({
					code: message,
					problem: {
						status: status as number,
						title: "User is not authenticated",
						type: "urn:problem-type:authentication-error",
					},
				});

				throw new Response(JSON.stringify(envelope), {
					status: status as number,
					headers: {
						"Content-Type": "application/problem+json",
						"www-authenticate": 'Bearer realm="api"',
					},
				});
			}
		});

export const requireRole = (roles: string[]) =>
	new Elysia({ name: "requireRole" })
		.use(withAuth())
		// NOTE: the 401 (authentication) check is inlined here rather than
		// delegated to `requireAuth()`. Elysia's `as: "scoped"` hooks/derives
		// propagate only one `.use()` level, so nesting `requireAuth` (which itself
		// uses `withAuth`) inside this plugin puts both the `withAuth` derive and
		// the 401 check two levels below the consuming route — they silently never
		// fire, and every request (including unauthenticated ones) falls through to
		// the 403 branch. Keeping a single `onBeforeHandle` at one level ensures
		// the auth check runs before the role check. Consumers should still call
		// `.use(withAuth())` directly on the route module (like `meRoutes` does) so
		// the `user`/`session` derive reaches the route handler.
		.onBeforeHandle({ as: "scoped" }, ({ session, user, set }) => {
			// 401 — not authenticated
			if (!(session && user)) {
				const { code: status, message } = getStatusCode(401);
				set.status = "Unauthorized";
				const envelope = formatErrorResponse({
					code: message,
					problem: {
						status: status as number,
						title: "User is not authenticated",
						type: "urn:problem-type:authentication-error",
					},
				});
				throw new Response(JSON.stringify(envelope), {
					status: status as number,
					headers: {
						"Content-Type": "application/problem+json",
						"www-authenticate": 'Bearer realm="api"',
					},
				});
			}

			// 403 — authenticated but lacking the required role
			const { role } = user || {};
			const hasRole = role && roles.includes(role);

			if (!hasRole) {
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
					headers: {
						"Content-Type": "application/problem+json",
					},
				});
			}
		});
