import * as Linking from "expo-linking";
import { Link } from "expo-router";
import { useState } from "react";
import { Platform, View } from "react-native";
import { Header } from "~/components/header";
import { Screen } from "~/components/screen";
import { ActivityIndicator } from "~/components/ui/activity-indicator";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { authClient } from "~/lib/auth-client";
import { toast } from "~/lib/sonner/sonner";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleResetPassword = async () => {
		if (!email) {
			toast.error("Please enter your email address", {
				position: "bottom-center",
			});
			return;
		}

		try {
			setIsLoading(true);

			const redirectTo =
				Platform.OS === "web"
					? `${window.location.origin}/auth/reset-password`
					: Linking.createURL("/auth/reset-password");

			const { error } = await authClient.requestPasswordReset({
				email,
				redirectTo,
			});

			if (error) {
				toast.error(`Failed to send reset instructions: ${error.message}`, {
					position: "bottom-center",
				});
				return;
			}

			toast.success(
				"Password reset instructions have been sent to your email",
				{
					position: "bottom-center",
				},
			);
		} catch (error) {
			console.error("Password reset error:", error);
			toast.error("Failed to send reset instructions. Please try again.", {
				position: "bottom-center",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Screen>
			<Header />
			<View className="w-full max-w-sm flex-1 justify-center gap-6 p-6">
				<View className="gap-2">
					<Text className="font-bold text-2xl">Reset your password</Text>
					<Text className="text-muted-foreground">
						Enter your email address and we'll send you instructions to reset
						your password.
					</Text>
				</View>
				<View className="gap-4">
					<Input
						autoCapitalize="none"
						id={"email"}
						keyboardType="email-address"
						onChangeText={setEmail}
						placeholder="Email"
						value={email}
					/>
				</View>
				<View>
					<Button
						className="flex-row items-center gap-4"
						onPress={handleResetPassword}
					>
						{isLoading && <ActivityIndicator />}
						<Text>{isLoading ? "Sending..." : "Reset Password"}</Text>
					</Button>
				</View>
				{/* Back to Sign In */}
				<View className="p-6 pt-0">
					<View className="flex-row items-center justify-center">
						<Text className="text-muted-foreground text-sm">
							Remember your password?{" "}
						</Text>
						<Link asChild dismissTo href="/(public)/auth/sign-in">
							<Text className="font-medium text-primary text-sm hover:underline">
								Sign in
							</Text>
						</Link>
					</View>
				</View>
			</View>
		</Screen>
	);
}
