import { type Observable, observable } from "@legendapp/state";
import { authClient } from "~/lib/auth-client";
import { toast } from "~/lib/sonner/sonner";
import type { ApiStatus } from "~/utils/api";
import { getErrorMessage } from "~/utils/error";

/**
 * EmailModel handles email operations (verification, password reset)
 */
export class EmailModel {
	obs: Observable<{
		resendVerificationStatus: ApiStatus;
		resetPasswordStatus: ApiStatus;
	}>;

	constructor() {
		this.obs = observable({
			resendVerificationStatus: "idle" as ApiStatus,
			resetPasswordStatus: "idle" as ApiStatus,
		});
	}

	/**
	 * Resends verification email
	 */
	async resendVerificationEmail({ email }: { email: string }): Promise<void> {
		this.obs.resendVerificationStatus.set("loading");

		try {
			const { error } = await authClient.sendVerificationEmail({ email });

			if (error) {
				throw new Error(error.message);
			}

			this.obs.resendVerificationStatus.set("success");
			toast.success("Verification email sent successfully");
		} catch (error) {
			const errorMessage = getErrorMessage(
				error,
				"Failed to send verification email",
			);
			this.obs.resendVerificationStatus.set("error");
			toast.error(errorMessage);
		}
	}

	/**
	 * Sends password reset email
	 */
	async resetPassword({ email }: { email: string }): Promise<void> {
		this.obs.resetPasswordStatus.set("loading");

		try {
			const { error } = await authClient.forgetPassword({ email });

			if (error) {
				throw new Error(error.message);
			}

			this.obs.resetPasswordStatus.set("success");
			toast.success("Password reset email sent successfully");
		} catch (error) {
			const errorMessage = getErrorMessage(
				error,
				"Failed to send password reset email",
			);
			this.obs.resetPasswordStatus.set("error");
			toast.error(errorMessage);
		}
	}
}