"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Screen } from "@/components/screen";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isResendingVerification, setIsResendingVerification] = useState(false);
	const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
	const router = useRouter();

	const handleLogin = async () => {
		try {
			setIsLoading(true);
			setShowVerificationPrompt(false);

			const { data, error } = await authClient.signIn.email(
				{ email, password },
				{
					onError: (ctx) => {
						if (ctx.error.status === 403) {
							setShowVerificationPrompt(true);
							toast.error("Please verify your email address");
						} else {
							toast.error(`Login failed: ${ctx.error.message}`);
						}
					},
				},
			);

			if (data && !error) {
				router.replace("/home");
			}
		} catch (error) {
			console.error("Login error:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendVerification = async () => {
		if (!email) {
			toast.error("Please enter your email address");
			return;
		}
		try {
			setIsResendingVerification(true);
			await authClient.sendVerificationEmail({ email, callbackURL: "/" });
			toast.success("Verification email sent! Please check your inbox.");
		} catch (error) {
			console.error("Verification email error:", error);
			toast.error("Failed to send verification email");
		} finally {
			setIsResendingVerification(false);
		}
	};

	return (
		<Screen>
			<div className="flex flex-1 flex-col justify-center gap-6 p-6">
				<div className="flex flex-col gap-2">
					<h1 className="text-2xl font-bold">Login to your account</h1>
					<p className="text-muted-foreground">
						Enter your email and password to sign in.
					</p>
				</div>
				<div className="flex flex-col gap-4">
					<Input
						id="email"
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<PasswordInput
						id="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Link
						href="/auth/forgot-password"
						className="mt-2 self-end text-right text-sm text-muted-foreground hover:text-primary hover:underline"
					>
						Forgot Password?
					</Link>
				</div>
				<div className="flex flex-col gap-3">
					<Button className="w-full" onClick={handleLogin} disabled={isLoading}>
						{isLoading && <ActivityIndicator />}
						{isLoading ? "Signing In..." : "Sign In"}
					</Button>

					{showVerificationPrompt && (
						<div className="w-full">
							<p className="mb-2 text-center text-sm text-muted-foreground">
								Email not verified? Check your inbox or resend verification.
							</p>
							<Button
								variant="outline"
								className="w-full"
								disabled={isResendingVerification}
								onClick={handleResendVerification}
							>
								{isResendingVerification && <ActivityIndicator />}
								{isResendingVerification
									? "Sending..."
									: "Resend Verification Email"}
							</Button>
						</div>
					)}
				</div>
				<div className="flex items-center justify-center">
					<span className="text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
					</span>
					<Link
						href="/auth/sign-up"
						className="text-sm font-medium text-primary hover:underline"
					>
						Sign up
					</Link>
				</div>
			</div>
		</Screen>
	);
}
