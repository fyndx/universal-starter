import { authClient } from "@/src/lib/auth-client";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
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
import { PasswordInput } from "~/components/ui/password";
import { Text } from "~/components/ui/text";
import { toast } from "~/lib/sonner/sonner";

export default function ResetPassword() {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [token, setToken] = useState<string | null>(null);

	const router = useRouter();
	const params = useLocalSearchParams();

	useEffect(() => {
		// Get token from URL params or search params
		let resetToken = params.token as string;

		// For web, also check window location search params
		if (!resetToken && typeof window !== "undefined") {
			resetToken = new URLSearchParams(window.location.search).get("token");
		}

		if (!resetToken) {
			toast.error("Invalid or missing reset token", {
				position: "bottom-center",
			});
			router.replace("/(public)/auth/sign-in");
			return;
		}

		setToken(resetToken);
	}, [params.token, router]);

	const handleResetPassword = async () => {
		if (!token) {
			toast.error("Invalid reset token", {
				position: "bottom-center",
			});
			return;
		}

		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match", {
				position: "bottom-center",
			});
			return;
		}

		if (newPassword.length < 8) {
			toast.error("Password must be at least 8 characters long", {
				position: "bottom-center",
			});
			return;
		}

		try {
			setIsLoading(true);
			const { error } = await authClient.resetPassword({
				newPassword,
				token,
			});

			if (error) {
				toast.error(`Password reset failed: ${error.message}`, {
					position: "bottom-center",
				});
				return;
			}

			toast.success(
				"Password reset successfully! Please sign in with your new password.",
				{
					position: "bottom-center",
				},
			);
			router.replace("/(public)/auth/sign-in");
		} catch (error) {
			console.error("Password reset error:", error);
			toast.error("An unexpected error occurred", {
				position: "bottom-center",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (!token) {
		return (
			<View className="flex-1 justify-center items-center">
				<View className="w-full max-w-sm">
					<Card>
						<CardContent className="p-6">
							<Text className="text-center text-muted-foreground">
								Loading...
							</Text>
						</CardContent>
					</Card>
				</View>
			</View>
		);
	}

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
							<CardTitle>Reset Your Password</CardTitle>
							<CardDescription>Enter your new password below.</CardDescription>
						</CardHeader>
						<CardContent className="gap-4">
							<PasswordInput
								id={"newPassword"}
								placeholder="New Password"
								value={newPassword}
								onChangeText={setNewPassword}
							/>
							<PasswordInput
								id={"confirmPassword"}
								placeholder="Confirm New Password"
								value={confirmPassword}
								onChangeText={setConfirmPassword}
							/>
						</CardContent>
						<CardFooter>
							<Button
								onPress={handleResetPassword}
								className="flex-1 flex-row items-center gap-4"
								disabled={!newPassword || !confirmPassword || isLoading}
							>
								{isLoading && <ActivityIndicator />}
								<Text>{isLoading ? "Resetting..." : "Reset Password"}</Text>
							</Button>
						</CardFooter>
						{/* Back to Sign In */}
						<View className="p-6 pt-0">
							<View className="flex-row justify-center items-center">
								<Text className="text-sm text-muted-foreground">
									Remember your password?{" "}
								</Text>
								<Link href="/(public)/auth/sign-in">
									<Text className="text-sm text-primary hover:underline font-medium">
										Sign in
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
