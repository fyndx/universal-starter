import { type Observable, observable } from "@legendapp/state";
import type { Session as BetterAuthSession } from "better-auth/types";
import { authClient } from "~/lib/auth-client";
import { toast } from "~/lib/sonner/sonner";
import type { ApiStatus } from "~/utils/api";
import { getErrorMessage } from "~/utils/error";

// Extended session type to include additional fields from Better Auth
interface ExtendedBetterAuthSession extends BetterAuthSession {
	userAgent?: string;
	ipAddress?: string;
}

// Extended session interface with display fields
export interface Session extends BetterAuthSession {
	device?: string;
	location?: string;
	lastActive?: string;
	current?: boolean;
	expired?: boolean;
}

/**
 * SessionModel handles user session management operations
 */
export class SessionModel {
	obs: Observable<{
		sessions: Session[];
		sessionsStatus: ApiStatus;
		revokeSessionStatus: ApiStatus;
		revokeAllSessionsStatus: ApiStatus;
		error?: string | null;
	}>;

	constructor() {
		this.obs = observable({
			sessions: [] as Session[],
			sessionsStatus: "idle" as ApiStatus,
			revokeSessionStatus: "idle" as ApiStatus,
			revokeAllSessionsStatus: "idle" as ApiStatus,
			error: null as string | null,
		});
	}

	/**
	 * Fetches user sessions by user ID
	 */
	async fetchUserSessionsById({ id }: { id: string }): Promise<void> {
		this.obs.sessionsStatus.set("loading");

		try {
			const { data, error } = await authClient.admin.listUserSessions({
				userId: id,
			});

			if (error) {
				throw new Error(error.message || "Failed to fetch user sessions");
			}

			const sessions: Session[] = this.transformSessions(data?.sessions || []);
			this.obs.sessions.set(sessions);
			this.obs.sessionsStatus.set("success");
		} catch (error) {
			const errorMessage = getErrorMessage(error, "Failed to load sessions");
			this.obs.sessionsStatus.set("error");
			this.obs.error.set(errorMessage);
			toast.error(errorMessage);
		}
	}

	/**
	 * Revokes a specific user session
	 */
	async revokeSingleSession({
		userId,
		sessionToken,
	}: {
		userId: string;
		sessionToken: string;
	}): Promise<void> {
		this.obs.revokeSessionStatus.set("loading");

		try {
			const { error } = await authClient.admin.revokeUserSession({
				sessionToken,
			});

			if (error) {
				throw new Error(error.message);
			}

			this.obs.revokeSessionStatus.set("success");
			await this.fetchUserSessionsById({ id: userId });
			toast.success("Session revoked successfully");
		} catch (error) {
			const errorMessage = getErrorMessage(error, "Failed to revoke session");
			this.obs.revokeSessionStatus.set("error");
			toast.error(errorMessage);
			throw error;
		}
	}

	/**
	 * Revokes all user sessions
	 */
	async revokeAllSessions({ userId }: { userId: string }): Promise<void> {
		this.obs.revokeAllSessionsStatus.set("loading");

		try {
			const { error } = await authClient.admin.revokeUserSessions({
				userId,
			});

			if (error) {
				throw new Error(error.message);
			}

			this.obs.revokeAllSessionsStatus.set("success");
			await this.fetchUserSessionsById({ id: userId });
			toast.success("All sessions revoked successfully");
		} catch (error) {
			const errorMessage = getErrorMessage(
				error,
				"Failed to revoke all sessions",
			);
			this.obs.revokeAllSessionsStatus.set("error");
			toast.error(errorMessage);
			throw error;
		}
	}

	/**
	 * Transforms session data from API to display format
	 */
	private transformSessions(sessions: BetterAuthSession[]): Session[] {
		const now = new Date();
		const currentSessionId = this.findCurrentSessionId(sessions);

		return sessions.map((session) => {
			const expiresAt = session.expiresAt ? new Date(session.expiresAt) : null;
			const isExpired = expiresAt ? now > expiresAt : false;
			const isCurrent = currentSessionId === session.id;

			return {
				...session,
				device: this.parseUserAgent(
					(session as ExtendedBetterAuthSession).userAgent || "",
				),
				location:
					(session as ExtendedBetterAuthSession).ipAddress ||
					"Unknown Location",
				lastActive: session.updatedAt
					? new Date(session.updatedAt).toLocaleString()
					: "Unknown",
				current: isCurrent,
				expired: isExpired,
			};
		});
	}

	/**
	 * Finds the ID of the current (most recently active and not expired) session
	 */
	private findCurrentSessionId(sessions: BetterAuthSession[]): string | null {
		if (sessions.length === 0) return null;

		const now = new Date();
		let mostRecentActiveSession: BetterAuthSession | null = null;
		let mostRecentActiveTime = 0;

		for (const session of sessions) {
			const expiresAt = session.expiresAt ? new Date(session.expiresAt) : null;
			const isExpired = expiresAt ? now > expiresAt : false;

			if (!isExpired && session.updatedAt) {
				const updateTime = new Date(session.updatedAt).getTime();
				if (updateTime > mostRecentActiveTime) {
					mostRecentActiveTime = updateTime;
					mostRecentActiveSession = session;
				}
			}
		}

		return mostRecentActiveSession?.id ?? null;
	}

	/**
	 * Parses user agent string to extract user-friendly device/browser info
	 */
	private parseUserAgent(userAgent: string): string {
		if (!userAgent) return "Unknown Device";

		// Browser detection
		let browser = "Unknown Browser";
		let os = "Unknown OS";

		// Browser patterns
		if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
			browser = "Chrome";
		} else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
			browser = "Safari";
		} else if (userAgent.includes("Firefox")) {
			browser = "Firefox";
		} else if (userAgent.includes("Edg")) {
			browser = "Edge";
		} else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
			browser = "Opera";
		}

		// OS detection
		if (userAgent.includes("Windows")) {
			os = "Windows";
		} else if (userAgent.includes("Mac OS X") || userAgent.includes("macOS")) {
			os = "macOS";
		} else if (userAgent.includes("Linux")) {
			os = "Linux";
		} else if (userAgent.includes("Android")) {
			os = "Android";
		} else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
			os = userAgent.includes("iPhone") ? "iOS" : "iPadOS";
		}

		// Mobile detection
		const isMobile =
			userAgent.includes("Mobile") ||
			userAgent.includes("Android") ||
			userAgent.includes("iPhone");
		const deviceType = isMobile ? "Mobile" : "Desktop";

		return `${browser} on ${os} (${deviceType})`;
	}
}
