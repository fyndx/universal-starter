import { authClient } from "~/lib/auth-client";
import { toast } from "~/lib/sonner/sonner";
import { EmailModel } from "./user-detail/email.model";
import { FormModel } from "./user-detail/form.model";
import { BAN_DURATIONS, ModerationModel } from "./user-detail/moderation.model";
import { type Session, SessionModel } from "./user-detail/session.model";
import { ROLE_OPTIONS, type User, UserModel } from "./user-detail/user.model";

// Re-export types and constants for backward compatibility
export { BAN_DURATIONS, ROLE_OPTIONS };
export type { Session, User };

/**
 * UserDetailModel - Refactored to use composition of focused models
 * Handles user management operations for admin interface
 */
export class UserDetailModel {
	// Composed models for different concerns
	public userModel: UserModel;
	public sessionModel: SessionModel;
	public moderationModel: ModerationModel;
	public emailModel: EmailModel;
	public formModel: FormModel;

	constructor() {
		// Initialize composed models
		this.userModel = new UserModel();
		this.sessionModel = new SessionModel();
		this.moderationModel = new ModerationModel();
		this.emailModel = new EmailModel();
		this.formModel = new FormModel();
	}

	// =============================================================================
	// DATA FETCHING METHODS (delegate to userModel and sessionModel)
	// =============================================================================

	async fetchUserById({ id }: { id: string }): Promise<void> {
		await this.userModel.fetchUserById({ id });
		const user = this.userModel.obs.user.peek();
		if (user) {
			this.formModel.initializeFormData(user);
		}
	}

	async fetchUserSessionsById({ id }: { id: string }): Promise<void> {
		await this.sessionModel.fetchUserSessionsById({ id });
	}

	// =============================================================================
	// UI STATE METHODS (delegate to appropriate models)
	// =============================================================================

	setBanUserOpen(open: boolean): void {
		this.moderationModel.setBanUserOpen(open);
	}

	setDeleteUserOpen(open: boolean): void {
		this.moderationModel.setDeleteUserOpen(open);
	}

	// =============================================================================
	// FORM STATE METHODS (delegate to appropriate models)
	// =============================================================================

	setFormData(
		updates: Partial<{
			name: string;
			email: string;
			role: string;
			banReason: string;
			banDuration: string;
		}>,
	): void {
		// Split updates between form and moderation models
		const formUpdates: Partial<{ name: string; email: string; role: string }> =
			{};
		const banFormUpdates: Partial<{ banReason: string; banDuration: string }> =
			{};

		if (updates.name !== undefined) formUpdates.name = updates.name;
		if (updates.email !== undefined) formUpdates.email = updates.email;
		if (updates.role !== undefined) formUpdates.role = updates.role;
		if (updates.banReason !== undefined)
			banFormUpdates.banReason = updates.banReason;
		if (updates.banDuration !== undefined)
			banFormUpdates.banDuration = updates.banDuration;

		if (Object.keys(formUpdates).length > 0) {
			this.formModel.setFormData(formUpdates);
		}
		if (Object.keys(banFormUpdates).length > 0) {
			this.moderationModel.setBanFormData(banFormUpdates);
		}
	}

	initializeFormData(user: User): void {
		this.formModel.initializeFormData(user);
	}

	// =============================================================================
	// ACTION HANDLERS (coordinate between models)
	// =============================================================================

	async handleBanUser(): Promise<void> {
		const user = this.userModel.obs.user.peek();
		if (!user?.id) return;

		await this.moderationModel.banUser({ userId: user.id });
		// Refresh user data after ban
		if (this.moderationModel.obs.banStatus.peek() === "success") {
			await this.userModel.fetchUserById({ id: user.id });
		}
	}

	async handleUnbanUser(): Promise<void> {
		const user = this.userModel.obs.user.peek();
		if (!user?.id) return;

		await this.moderationModel.unbanUser({ userId: user.id });
		// Refresh user data after unban
		if (this.moderationModel.obs.banStatus.peek() === "success") {
			await this.userModel.fetchUserById({ id: user.id });
		}
	}

	async handleDeleteUser(): Promise<void> {
		const user = this.userModel.obs.user.peek();
		if (!user?.id) return;

		await this.moderationModel.deleteUser({ userId: user.id });
		this.moderationModel.setDeleteUserOpen(false);
	}

	async handleSessionRevoke({
		userId,
		sessionToken,
	}: {
		userId: string;
		sessionToken: string;
	}): Promise<void> {
		await this.sessionModel.revokeSingleSession({
			userId,
			sessionToken,
		});
	}

	async handleAllSessionsRevoke({ userId }: { userId: string }): Promise<void> {
		await this.sessionModel.revokeAllSessions({ userId });
	}

	async handleResendVerification(): Promise<void> {
		const user = this.userModel.obs.user.peek();
		if (user?.email) {
			await this.emailModel.resendVerificationEmail({ email: user.email });
		}
	}

	async handleImpersonateUser(): Promise<void> {
		const user = this.userModel.obs.user.peek();
		if (!user?.id) return;

		this.userModel.obs.impersonateStatus.set("loading");
		try {
			const { error } = await authClient.admin.impersonateUser({
				userId: user.id,
			});

			if (error) {
				throw new Error(error.message || "Failed to impersonate user");
			}

			this.userModel.obs.impersonateStatus.set("success");
			toast.success(`Successfully impersonating ${user.name || user.email}`);
			window.location.reload(); // Reload to apply impersonation changes
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to impersonate user";
			this.userModel.obs.impersonateStatus.set("error");
			toast.error(errorMessage);
		}
	}

	async handleResetPassword(): Promise<void> {
		const user = this.userModel.obs.user.peek();
		if (user?.email) {
			await this.emailModel.resetPassword({ email: user.email });
		}
	}

	async handleSaveChanges(): Promise<void> {
		const user = this.userModel.obs.user.peek();
		if (!user?.id) return;

		const changes = this.formModel.getChanges(user);

		if (
			!changes.hasNameChange &&
			!changes.hasEmailChange &&
			!changes.hasRoleChange
		) {
			toast.info("No changes to save");
			return;
		}

		this.userModel.obs.saveStatus.set("loading");
		try {
			// Update user data if there are user field changes
			if (changes.hasNameChange || changes.hasEmailChange) {
				await this.userModel.updateUser({
					userId: user.id,
					updates: changes.userUpdates,
				});
			}

			// Update role if changed
			if (changes.hasRoleChange && changes.newRole) {
				await this.userModel.updateUserRole({
					userId: user.id,
					role: changes.newRole,
				});
			}

			this.userModel.obs.saveStatus.set("success");
		} catch (_error) {
			this.userModel.obs.saveStatus.set("error");
			toast.error("Failed to save changes");
		}
	}
}
