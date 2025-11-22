import { authClient } from "@/src/lib/auth-client";
import { Link, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "~/components/ui/activity-indicator";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { PasswordInput } from "~/components/ui/password";
import { Text } from "~/components/ui/text";
import { toast } from "~/lib/sonner/sonner";

export default function SignIn() {
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
				{
					email,
					password,
				},
				{
					onError: (ctx) => {
						if (ctx.error.status === 403) {
							setShowVerificationPrompt(true);
							toast.error("Please verify your email address", {
								position: "bottom-center",
							});
						} else {
							toast.error(`Login failed: ${ctx.error.message}`, {
								position: "bottom-center",
							});
						}
					},
				},
			);

			if (data && !error) {
				router.replace("/home");
			}
		} catch (error) {
			console.error("Login error:", error);
			toast.error("An unexpected error occurred", {
				position: "bottom-center",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendVerification = async () => {
		if (!email) {
			toast.error("Please enter your email address", {
				position: "bottom-center",
			});
			return;
		}

		try {
			setIsResendingVerification(true);
			await authClient.sendVerificationEmail({
				email,
				callbackURL: "/",
			});

			toast.success("Verification email sent! Please check your inbox.", {
				position: "bottom-center",
			});
		} catch (error) {
			console.error("Verification email error:", error);
			toast.error("Failed to send verification email", {
				position: "bottom-center",
			});
		} finally {
			setIsResendingVerification(false);
		}
	};

	return (
		<View className="flex-1 justify-center items-center">
			<View className="w-full max-w-sm">
				<MotiView
					from={{ opacity: 0, translateY: -20 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{ type: "timing", duration: 300 }}
				>
					<Card>
						<CardHeader>
							<CardTitle>Login to your account</CardTitle>
							<CardDescription>
								Enter your email and password to sign in.
							</CardDescription>
						</CardHeader>
						<CardContent className="gap-4">
							<Input
								id={"email"}
								placeholder="Email"
								value={email}
								onChangeText={setEmail}
							/>
							<PasswordInput
								id={"password"}
								placeholder="Password"
								value={password}
								onChangeText={setPassword}
							/>
							{/* Forgot Password */}
							<Link href="/(public)/auth/forgot-password">
								<Text className="mt-2 text-right text-sm text-muted-foreground self-end hover:underline hover:text-primary">
									Forgot Password?
								</Text>
							</Link>
						</CardContent>
						<CardFooter className="flex-col gap-3">
							<Button
								onPress={handleLogin}
								className="flex-row items-center gap-4"
							>
								{isLoading && <ActivityIndicator />}
								<Text>{isLoading ? "Signing In..." : "Sign In"}</Text>
							</Button>

							{showVerificationPrompt && (
								<View className="w-full">
									<Text className="text-sm text-muted-foreground text-center mb-2">
										Email not verified? Check your inbox or resend verification.
									</Text>
									<Button
										variant="outline"
										onPress={handleResendVerification}
										disabled={isResendingVerification}
										className="flex-row items-center gap-2"
									>
										{isResendingVerification && <ActivityIndicator />}
										<Text>
											{isResendingVerification
												? "Sending..."
												: "Resend Verification Email"}
										</Text>
									</Button>
								</View>
							)}
						</CardFooter>
						{/* Sign Up Option */}
						<View className="p-6 pt-0">
							<View className="flex-row justify-center items-center">
								<Text className="text-sm text-muted-foreground">
									Don't have an account?{" "}
								</Text>
								<Link href="/(public)/auth/sign-up">
									<Text className="text-sm text-primary hover:underline font-medium">
										Sign up
									</Text>
								</Link>
							</View>
						</View>
					</Card>
				</MotiView>
			</View>
		</View>
	);
}
