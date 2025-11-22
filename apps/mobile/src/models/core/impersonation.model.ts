import { type Observable, observable } from "@legendapp/state";
import { authClient } from "~/lib/auth-client";
import { toast } from "~/lib/sonner/sonner";
import type { ApiStatus } from "~/utils/api";

type SessionData = {
	session: {
		impersonatedBy?: string | null;
	};
	user: {
		name: string;
	};
} | null;

export class ImpersonationModel {
	obs: Observable<{
		isImpersonating: boolean;
		impersonatedUserName: string | null;
		stopImpersonationStatus: ApiStatus;
		error?: string | null;
	}>;

	constructor() {
		this.obs = observable({
			isImpersonating: false as boolean,
			impersonatedUserName: null as string | null,
			stopImpersonationStatus: "idle" as ApiStatus,
			error: null as string | null,
		});
	}

	// Method to update state when session changes
	syncWithSession({ sessionData }: { sessionData: SessionData }): void {
		const isImpersonating = !!sessionData?.session.impersonatedBy;
		const impersonatedUserName = isImpersonating
			? sessionData?.user.name
			: null;

		this.obs.assign({
			isImpersonating,
			impersonatedUserName,
		});
	}

	async stopImpersonating(): Promise<void> {
		this.obs.stopImpersonationStatus.set("loading");

		try {
			// Call the authClient method to stop impersonation
			await authClient.admin.stopImpersonating();

			this.obs.set({
				...this.obs.peek(),
				stopImpersonationStatus: "success",
				isImpersonating: false,
				impersonatedUserName: null,
			});

			// Handle success side effects
			toast.success("Stopped impersonating user");

			// Trigger a session refresh
			window.location.reload();
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to stop impersonating";
			this.obs.set({
				...this.obs.peek(),
				stopImpersonationStatus: "error",
				error: errorMessage,
			});

			// Handle error side effects
			toast.error(errorMessage);
		}
	}
}

// Create a singleton instance
export const impersonationModel$ = new ImpersonationModel();
