import { getStatusCode } from "@readme/http-status-codes";
import Elysia from "elysia";
import { formatErrorResponse } from "../utils/format-response";
import { withAuth } from "./auth";

export const requireAuth = () =>
	new Elysia({ name: "requireAuth" })
		.use(withAuth())
		.onBeforeHandle({ as: "scoped" }, ({ session, user, set }) => {
			if (!session || !user) {
				const { code, message } = getStatusCode(401);
				set.status = 401;
				throw formatErrorResponse({
					code: message,
					problem: {
						status: code as number,
						title: "User is not authenticated",
						type: "AUTHENTICATION_ERROR",
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
				set.status = 403;
				const { code, message } = getStatusCode(403);
				throw formatErrorResponse({
					code: message,
					problem: {
						status: code as number,
						title: "User is not authorized",
						type: "AUTHORIZATION_ERROR",
					},
				});
			}
		});
