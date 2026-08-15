"use client";

import Link from "next/link";
import { useState } from "react";
import { Screen } from "@/components/screen";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleResetPassword = async () => {
		if (!email) {
			toast.error("Please enter your email address");
			return;
		}
		try {
			setIsLoading(true);
			const redirectTo = `${window.location.origin}/auth/reset-password`;
			const { error } = await authClient.requestPasswordReset({
				email,
				redirectTo,
			});
			if (error) {
				toast.error(`Failed to send reset instructions: ${error.message}`);
				return;
			}
			toast.success("Password reset instructions have been sent to your email");
		} catch (error) {
			console.error("Password reset error:", error);
			toast.error("Failed to send reset instructions. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Screen>
			<div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-6">
				<div className="flex flex-col gap-2">
					<h1 className="text-2xl font-bold">Reset your password</h1>
					<p className="text-muted-foreground">
						Enter your email address and we&apos;ll send you instructions to
						reset your password.
					</p>
				</div>
				<div className="flex flex-col gap-4">
					<Input
						id="email"
						type="email"
						autoCapitalize="none"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<Button className="w-full" onClick={handleResetPassword}>
					{isLoading && <ActivityIndicator />}
					{isLoading ? "Sending..." : "Reset Password"}
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
