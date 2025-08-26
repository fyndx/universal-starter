import { getStatusCode } from "@readme/http-status-codes";
import Elysia from "elysia";
import { formatErrorResponse } from "../utils/format-response";
import { withAuth } from "./auth";

export const requireAuth = () =>
	new Elysia({ name: "requireAuth" })
		.use(withAuth())
		.onBeforeHandle({ as: "scoped" }, ({ session, user, set }) => {
			if (!session || !user) {
				const { code: status, message } = getStatusCode(401);
				set.status = status as number;
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
						"Content-Type": "application/problem+json, charset=utf-8",
						"www-authenticate": 'Bearer realm="api"',
					},
				});
			}
		});

export const requireRole = (roles: string[]) =>
	new Elysia({ name: "requireRole" })
		.use(withAuth())
		.use(requireAuth())
		.onBeforeHandle({ as: "scoped" }, ({ user, set }) => {
			const { role } = user || {};
			const hasRole = role && roles.includes(role);

			if (!hasRole) {
				const { code: status, message } = getStatusCode(403);

				set.status = status as number;
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
						"Content-Type": "application/problem+json, charset=utf-8",
					},
				});
			}
		});
