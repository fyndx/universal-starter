import { type Observable, observable } from "@legendapp/state";
import { router } from "expo-router";
import { authClient } from "~/lib/auth-client";
import { toast } from "~/lib/sonner/sonner";
import type { ApiStatus } from "~/utils/api";
import { getErrorMessage } from "~/utils/error";

// Ban duration options in days
export const BAN_DURATIONS = [
	{ label: "1 day", value: "1" },
	{ label: "3 days", value: "3" },
	{ label: "7 days", value: "7" },
	{ label: "14 days", value: "14" },
	{ label: "30 days", value: "30" },
	{ label: "90 days", value: "90" },
	{ label: "Permanent", value: "permanent" },
];

/**
 * ModerationModel handles user moderation operations (ban/unban/delete)
 */
export class ModerationModel {
	obs: Observable<{
		banStatus: ApiStatus;
		deleteStatus: ApiStatus;
		banUserOpen: boolean;
		deleteUserOpen: boolean;
	}>;

	// Ban form data
	banFormData$: Observable<{
		banReason: string;
		banDuration: string;
	}>;

	constructor() {
		this.obs = observable({
			banStatus: "idle" as ApiStatus,
			deleteStatus: "idle" as ApiStatus,
			banUserOpen: false,
			deleteUserOpen: false,
		});

		this.banFormData$ = observable({
			banReason: "",
			banDuration: "",
		});
	}

	setBanUserOpen(open: boolean): void {
		this.obs.banUserOpen.set(open);
	}

	setDeleteUserOpen(open: boolean): void {
		this.obs.deleteUserOpen.set(open);
	}

	setBanFormData(
		updates: Partial<{
			banReason: string;
			banDuration: string;
		}>,
	): void {
		this.banFormData$.assign(updates);
	}

	/**
	 * Bans a user
	 */
	async banUser({ userId }: { userId: string }): Promise<void> {
		const { banReason, banDuration } = this.banFormData$.peek();

		if (!banReason.trim()) {
			toast.error("Ban reason is required");
			return;
		}

		this.obs.banStatus.set("loading");
		try {
			let banExpiresIn: number | undefined;

			if (banDuration && banDuration !== "permanent") {
				const days = parseInt(banDuration);
				banExpiresIn = 60 * 60 * 24 * days; // Convert days to seconds
			}

			const { error } = await authClient.admin.banUser({
				userId,
				banReason: banReason.trim(),
				...(banExpiresIn && { banExpiresIn }),
			});

			if (error) {
				throw new Error(error.message);
			}

			this.resetBanForm();
			this.obs.banStatus.set("success");
			toast.success("User banned successfully");
		} catch (error) {
			const errorMessage = getErrorMessage(error, "Failed to ban user");
			this.obs.banStatus.set("error");
			toast.error(errorMessage);
		}
	}

	/**
	 * Unbans a user
	 */
	async unbanUser({ userId }: { userId: string }): Promise<void> {
		this.obs.banStatus.set("loading");
		try {
			const { error } = await authClient.admin.unbanUser({
				userId,
			});

			if (error) {
				throw new Error(error.message);
			}

			this.obs.banStatus.set("success");
			toast.success("User unbanned successfully");
		} catch (error) {
			const errorMessage = getErrorMessage(error, "Failed to unban user");
			this.obs.banStatus.set("error");
			toast.error(errorMessage);
		}
	}

	/**
	 * Deletes a user
	 */
	async deleteUser({ userId }: { userId: string }): Promise<void> {
		this.obs.deleteStatus.set("loading");
		try {
			const { error } = await authClient.admin.removeUser({
				userId,
			});

			if (error) {
				throw new Error(error.message);
			}

			this.obs.deleteStatus.set("success");
			toast.success("User deleted successfully");
			router.back();
		} catch (error) {
			const errorMessage = getErrorMessage(error, "Failed to delete user");
			this.obs.deleteStatus.set("error");
			toast.error(errorMessage);
		}
	}

	/**
	 * Resets ban form state
	 */
	private resetBanForm(): void {
		this.obs.banUserOpen.set(false);
		this.banFormData$.banReason.set("");
		this.banFormData$.banDuration.set("");
	}
}