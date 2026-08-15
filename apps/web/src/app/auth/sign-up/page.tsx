"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Screen } from "@/components/screen";
import {
	SignUpForm,
	type SignUpFormData,
} from "@/components/auth/sign-up-form";
import { SignUpSuccessCard } from "@/components/auth/sign-up-success-card";
import { authClient } from "@/lib/auth-client";
import type { ApiStatus } from "@/lib/api-status";
import { toast } from "sonner";

type SignUpStatus = "idle" | "loading" | "success" | "error";

export default function SignUpPage() {
	const router = useRouter();
	const [status, setStatus] = useState<SignUpStatus>("idle");
	const [formData, setFormData] = useState<SignUpFormData>({
		name: "",
		email: "",
		password: "",
	});
	const [resendVerificationStatus, setResendVerificationStatus] =
		useState<ApiStatus>("idle");

	const handleFormDataChange = (field: keyof SignUpFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSignUp = async () => {
		const { name, email, password } = formData;
		setStatus("loading");
		try {
			const { error } = await authClient.signUp.email({
				email,
				password,
				name,
			});
			if (error) {
				setStatus("error");
				toast.error(`Sign up failed: ${error.message}`);
				return;
			}
			setStatus("success");
			toast.success("Account created successfully!");
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to create account";
			setStatus("error");
			toast.error(message);
		}
	};

	const handleContinue = () => {
		router.replace("/home");
	};

	const handleResendVerification = async () => {
		const { email } = formData;
		setResendVerificationStatus("loading");
		try {
			const { error } = await authClient.sendVerificationEmail({ email });
			if (error) throw new Error(error.message);
			setResendVerificationStatus("success");
			toast.success("Verification email sent successfully");
		} catch (error) {
			setResendVerificationStatus("error");
			const message =
				error instanceof Error
					? error.message
					: "Failed to send verification email";
			toast.error(message);
		}
	};

	return (
		<Screen className="items-center">
			<div className="flex w-full max-w-sm flex-1 flex-col justify-center p-6">
				{status === "success" ? (
					<SignUpSuccessCard
						onContinue={handleContinue}
						onResendVerification={handleResendVerification}
						resendVerificationStatus={resendVerificationStatus}
						userEmail={formData.email}
						userName={formData.name}
					/>
				) : (
					<SignUpForm
						formData={formData}
						isLoading={status === "loading"}
						onFormDataChange={handleFormDataChange}
						onSubmit={handleSignUp}
					/>
				)}
			</div>
		</Screen>
	);
}
