"use client";

import { Button } from "@/components/ui/button";
import type { ApiStatus } from "@/lib/api-status";

export function SignUpSuccessCard({
	userName,
	userEmail,
	onContinue,
	onResendVerification,
	resendVerificationStatus,
}: {
	userName: string;
	userEmail: string;
	onContinue: () => void;
	onResendVerification: () => void;
	resendVerificationStatus: ApiStatus;
}) {
	const isResending = resendVerificationStatus === "loading";
	const hasResendError = resendVerificationStatus === "error";
	const hasResendSuccess = resendVerificationStatus === "success";

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-center text-2xl font-bold">Check your email! 📧</h1>
				<p className="text-center text-muted-foreground">
					Your account has been created successfully.
				</p>
			</div>
			<div className="flex flex-col items-center gap-4">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
					<span className="text-3xl">📧</span>
				</div>
				<p className="text-center text-muted-foreground">
					Welcome, {userName}! We&apos;ve sent a verification email to{" "}
					<span className="font-medium text-foreground">{userEmail}</span>
				</p>
				<p className="text-center text-sm text-muted-foreground">
					Please check your email and click the verification link to complete
					your account setup.
				</p>
			</div>
			<div className="flex flex-col gap-3">
				<Button onClick={onContinue} className="w-full">
					Continue to App
				</Button>
				<Button
					variant="outline"
					onClick={onResendVerification}
					disabled={isResending}
					className="w-full"
				>
					{isResending ? "Sending..." : "Resend verification email"}
				</Button>
				{hasResendSuccess && (
					<p className="text-center text-sm text-green-600 dark:text-green-400">
						Verification email sent successfully!
					</p>
				)}
				{hasResendError && (
					<p className="text-center text-sm text-red-600 dark:text-red-400">
						Failed to send verification email. Please try again.
					</p>
				)}
			</div>
		</div>
	);
}
