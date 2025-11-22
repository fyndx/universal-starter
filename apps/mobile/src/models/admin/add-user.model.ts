import { type Observable, observable } from "@legendapp/state";
import { router } from "expo-router";
import { authClient } from "~/lib/auth-client";
import { toast } from "~/lib/sonner/sonner";
import type { ApiStatus } from "~/utils/api";

export type UserRole = "user" | "admin";

export interface AddUserForm {
	name: string;
	email: string;
	password: string;
	role: UserRole;
	autoVerify: boolean;
}

export interface AddUserState {
	form: AddUserForm;
	status: ApiStatus;
	error: string | null;
}

export class AddUserModel {
	obs: Observable<AddUserState>;

	constructor() {
		this.obs = observable({
			form: {
				name: "",
				email: "",
				password: "",
				role: "user" as UserRole,
				autoVerify: false,
			},
			status: "idle" as ApiStatus,
			error: null,
		});
	}

	updateForm(updates: Partial<AddUserForm>) {
		this.obs.form.assign(updates);
	}

	resetForm() {
		this.obs.form.set({
			name: "",
			email: "",
			password: "",
			role: "user",
			autoVerify: false,
		});
	}

	async createUser(): Promise<void> {
		const form = this.obs.form.peek();

		// Validation
		if (!form.name || !form.email || !form.password) {
			this.obs.error.set("Please fill in all required fields");
			toast.error("Please fill in all required fields", {
				position: "bottom-center",
			});
			return;
		}

		this.obs.set({
			...this.obs.peek(),
			status: "loading",
			error: null,
		});

		try {
			const { error } = await authClient.admin.createUser({
				email: form.email,
				password: form.password,
				name: form.name,
				role: form.role,
				data: { autoVerify: form.autoVerify },
			});

			if (error) {
				throw new Error(error.message || "Failed to create user");
			}

			this.obs.set({
				...this.obs.peek(),
				status: "success",
				error: null,
			});

			// Handle success actions
			toast.success("User created successfully", {
				position: "bottom-center",
			});

			// Reset form on success
			this.resetForm();

			// Navigate back
			router.back();
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create user";

			this.obs.set({
				...this.obs.peek(),
				status: "error",
				error: errorMessage,
			});

			// Handle error actions
			toast.error(errorMessage, {
				position: "bottom-center",
			});
		}
	}

	clearError() {
		this.obs.error.set(null);
	}
}

export const addUserModel = new AddUserModel();
