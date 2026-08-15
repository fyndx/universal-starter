import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/env";

/**
 * Web auth client. Mirrors the mobile app's configuration but drops the
 * Expo/SecureStore specifics (cookies handle sessions in the browser).
 * The `adminClient` plugin powers the admin user-management screens.
 */
export const authClient = createAuthClient({
	baseURL: `${env.NEXT_PUBLIC_API_URL}/api/auth`,
	plugins: [adminClient()],
	fetchOptions: {
		credentials: "include",
		mode: "cors",
	},
});
