import { authClient } from "@/src/lib/auth-client";
import { type Observable, observable } from "@legendapp/state";
import { router } from "expo-router";
import { toast } from "~/lib/sonner/sonner";
import { EmailModel } from "~/models/admin/user-detail/email.model";

type SignUpStatus = "idle" | "loading" | "success" | "error";

interface SignUpFormData {
	name: string;
	email: string;
	password: string;
}

interface SignUpState {
	status: SignUpStatus;
	formData: SignUpFormData;
	error?: string | null;
}

export class SignUpModel {
	obs: Observable<SignUpState>;
	emailModel: EmailModel;

	constructor() {
		this.obs = observable({
			status: "idle" as SignUpStatus,
			formData: {
				name: "",
				email: "",
				password: "",
			},
			error: null,
		});
		this.emailModel = new EmailModel();
	}

	updateFormData({ field, value }: { field: string; value: string }): void {
		this.obs.formData[field as keyof SignUpFormData].set(value);
	}

	async signUp(): Promise<void> {
		const { name, email, password } = this.obs.formData.peek();

		this.obs.status.set("loading");

		try {
			const { error } = await authClient.signUp.email({
				email,
				password,
				name,
			});

			if (error) {
				this.obs.set({
					...this.obs.peek(),
					status: "error",
					error: error.message,
				});
				toast.error(`Sign up failed: ${error.message}`, {
					position: "bottom-center",
				});
				return;
			}

			this.obs.status.set("success");
			toast.success("Account created successfully!", {
				position: "bottom-center",
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create account";
			this.obs.set({
				...this.obs.peek(),
				status: "error",
				error: errorMessage,
			});
			toast.error(errorMessage, {
				position: "bottom-center",
			});
		}
	}

	async resendVerification(): Promise<void> {
		const { email } = this.obs.formData.peek();
		await this.emailModel.resendVerificationEmail({ email });
	}

	continueToApp(): void {
		router.replace("/home");
	}

	reset(): void {
		this.obs.set({
			status: "idle",
			formData: {
				name: "",
				email: "",
				password: "",
			},
			error: null,
		});
	}
}

export const signUpModel$ = new SignUpModel();
