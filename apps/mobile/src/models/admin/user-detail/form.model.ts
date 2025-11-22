import { type Observable, observable } from "@legendapp/state";
import type { User } from "./user.model";

/**
 * FormModel handles form state for user detail editing
 */
export class FormModel {
	obs: Observable<{
		name: string;
		email: string;
		role: string;
	}>;

	constructor() {
		this.obs = observable({
			name: "",
			email: "",
			role: "user",
		});
	}

	setFormData(
		updates: Partial<{
			name: string;
			email: string;
			role: string;
		}>,
	): void {
		this.obs.assign(updates);
	}

	/**
	 * Initializes form data when user is loaded
	 */
	initializeFormData(user: User): void {
		this.obs.set({
			name: user.name || "",
			email: user.email,
			role: user.role || "user",
		});
	}

	/**
	 * Determines what changes need to be applied
	 */
	getChanges(user: User): {
		hasNameChange: boolean;
		hasEmailChange: boolean;
		hasRoleChange: boolean;
		userUpdates: Partial<User>;
		newRole?: string;
	} {
		const form = this.obs.peek();
		
		const hasNameChange = form.name.trim() !== (user.name || "");
		const hasEmailChange = form.email.trim() !== user.email;
		const hasRoleChange = form.role !== (user.role || "user");

		const userUpdates: Partial<User> = {};

		if (hasNameChange) {
			userUpdates.name = form.name.trim();
		}

		if (hasEmailChange) {
			userUpdates.email = form.email.trim();
			userUpdates.emailVerified = false;
		}

		return {
			hasNameChange,
			hasEmailChange,
			hasRoleChange,
			userUpdates,
			newRole: hasRoleChange ? form.role : undefined,
		};
	}
}