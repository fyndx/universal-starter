import { type Observable, observable } from "@legendapp/state";
import { authClient } from "~/lib/auth-client";
import { toast } from "~/lib/sonner/sonner";
import type { ApiStatus } from "~/utils/api";
import { getErrorMessage } from "~/utils/error";

// Extended user interface with admin-specific fields
export interface User {
	id: string;
	email: string;
	name?: string;
	banned?: boolean;
	banReason?: string;
	banExpires?: string;
	lastLogin?: string;
	role?: string;
	emailVerified?: boolean;
	createdAt: string;
	updatedAt?: string;
}

// Role options for user management
export const ROLE_OPTIONS = [
	{ label: "User", value: "user" },
	{ label: "Admin", value: "admin" },
];

/**
 * UserModel handles core user data operations
 */
export class UserModel {
	obs: Observable<{
		status: ApiStatus;
		user?: User | null;
		error?: string | null;
		saveStatus: ApiStatus;
		impersonateStatus: ApiStatus;
	}>;

	constructor() {
		this.obs = observable({
			status: "idle" as ApiStatus,
			user: null as User | null,
			error: null as string | null,
			saveStatus: "idle" as ApiStatus,
			impersonateStatus: "idle" as ApiStatus,
		});
	}

	/**
	 * Fetches user data by ID
	 */
	async fetchUserById({ id }: { id: string }): Promise<void> {
		this.obs.status.set("loading");
		this.obs.error.set(null);

		try {
			const { data, error } = await authClient.admin.listUsers({
				query: {
					filterField: "id",
					filterValue: id,
					filterOperator: "eq",
					limit: 1,
				},
			});

			if (error) {
				throw new Error(error.message);
			}

			const user = data?.users?.[0];
			if (!user) {
				throw new Error("User not found");
			}

			this.obs.status.set("success");
			this.obs.user.set({
				...user,
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt?.toISOString(),
			} as User);
		} catch (error) {
			const errorMessage = getErrorMessage(error, "Failed to fetch user");
			this.obs.status.set("error");
			this.obs.user.set(null);
			this.obs.error.set(errorMessage);
			toast.error(errorMessage);
		}
	}

	/**
	 * Updates user data
	 */
	async updateUser({
		userId,
		updates,
	}: {
		userId: string;
		updates: Partial<User>;
	}): Promise<void> {
		try {
			const { error } = await authClient.admin.updateUser({
				userId,
				data: updates,
			});

			if (error) {
				throw new Error(error.message);
			}

			await this.fetchUserById({ id: userId });
			toast.success("User updated successfully");
		} catch (error) {
			const errorMessage = getErrorMessage(error, "Failed to update user");
			toast.error(errorMessage);
			throw error;
		}
	}

	/**
	 * Updates user role
	 */
	async updateUserRole({
		userId,
		role,
	}: {
		userId: string;
		role: string;
	}): Promise<void> {
		try {
			const { error } = await authClient.admin.setRole({
				userId,
				role: role as "user" | "admin",
			});

			if (error) {
				throw new Error(error.message);
			}

			await this.fetchUserById({ id: userId });
			toast.success("User role updated successfully");
		} catch (error) {
			const errorMessage = getErrorMessage(error, "Failed to update user role");
			toast.error(errorMessage);
			throw error;
		}
	}
}
