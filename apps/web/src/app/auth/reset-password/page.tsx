"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Screen } from "@/components/screen";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

function ResetPasswordContent() {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [token, setToken] = useState<string | null>(null);

	const router = useRouter();
	const params = useSearchParams();

	useEffect(() => {
		const resetToken = params.get("token");
		if (!resetToken) {
			toast.error("Invalid or missing reset token");
			router.replace("/auth/sign-in");
			return;
		}
		setToken(resetToken);
	}, [params, router]);

	const handleResetPassword = async () => {
		if (!token) {
			toast.error("Invalid reset token");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		if (newPassword.length < 8) {
			toast.error("Password must be at least 8 characters long");
			return;
		}
		try {
			setIsLoading(true);
			const { error } = await authClient.resetPassword({ newPassword, token });
			if (error) {
				toast.error(`Password reset failed: ${error.message}`);
				return;
			}
			toast.success(
				"Password reset successfully! Please sign in with your new password.",
			);
			router.replace("/auth/sign-in");
		} catch (error) {
			console.error("Password reset error:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	if (!token) {
		return (
			<Screen className="items-center justify-center">
				<div className="w-full max-w-sm p-6">
					<p className="text-center text-muted-foreground">Loading...</p>
				</div>
			</Screen>
		);
	}

	return (
		<Screen>
			<div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-6">
				<div className="flex flex-col gap-2">
					<h1 className="text-2xl font-bold">Reset Your Password</h1>
					<p className="text-muted-foreground">
						Enter your new password below.
					</p>
				</div>
				<div className="flex flex-col gap-4">
					<PasswordInput
						id="newPassword"
						placeholder="New Password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
					<PasswordInput
						id="confirmPassword"
						placeholder="Confirm New Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				<Button
					className="w-full"
					disabled={!(newPassword && confirmPassword) || isLoading}
					onClick={handleResetPassword}
				>
					{isLoading && <ActivityIndicator />}
					{isLoading ? "Resetting..." : "Reset Password"}
				</Button>
				<div className="flex items-center justify-center">
					<span className="text-sm text-muted-foreground">
						Remember your password?{" "}
					</span>
					<Link
						href="/auth/sign-in"
						className="text-sm font-medium text-primary hover:underline"
					>
						Sign in
					</Link>
				</div>
			</div>
		</Screen>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense
			fallback={
				<Screen className="items-center justify-center">
					<div className="w-full max-w-sm p-6">
						<p className="text-center text-muted-foreground">Loading...</p>
					</div>
				</Screen>
			}
		>
			<ResetPasswordContent />
		</Suspense>
	);
}
