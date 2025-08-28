import { auth } from "@/src/lib/auth";
import Elysia from "elysia";

export const withAuth = () =>
	new Elysia({ name: "withAuth" })
		.decorate("auth", auth)
		.derive({ as: "scoped" }, async ({ request: { headers } }) => {
			const result = await auth.api.getSession({ headers });
			if (!result) return { user: null, session: null };
			return { user: result.user, session: result.session };
		});
