import { View } from "react-native";
import { Button } from "~/components/ui/button";

import { SkiaLoader } from "~/components/ui/skia-loader";
import { Text } from "~/components/ui/text";
import type { ApiStatus } from "~/utils/api";

interface SignUpSuccessCardProps {
	userName: string;
	userEmail: string;
	onContinue: () => void;
	onResendVerification: () => void;
	resendVerificationStatus: ApiStatus;
}

export function SignUpSuccessCard({
	userName,
	userEmail,
	onContinue,
	onResendVerification,
	resendVerificationStatus,
}: SignUpSuccessCardProps) {
	const isResending = resendVerificationStatus === "loading";
	const hasResendError = resendVerificationStatus === "error";
	const hasResendSuccess = resendVerificationStatus === "success";

	return (
		<>
			<SkiaLoader component={() => import("~/components/ui/confetti")} />
			<View className="gap-6">
				<View className="gap-2">
					<Text className="text-center text-2xl font-bold">Check your email! 📧</Text>
					<Text className="text-center text-muted-foreground">
						Your account has been created successfully.
					</Text>
				</View>
				<View className="items-center gap-4">
					<View className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center">
						<Text className="text-3xl">📧</Text>
					</View>
					<Text className="text-center text-muted-foreground">
						Welcome, {userName}! We've sent a verification email to{" "}
						<Text className="font-medium text-foreground">{userEmail}</Text>
					</Text>
					<Text className="text-center text-sm text-muted-foreground">
						Please check your email and click the verification link to complete
						your account setup.
					</Text>
				</View>
				<View className="flex-col gap-3">
					<Button onPress={onContinue} className="w-full">
						<Text>Continue to App</Text>
					</Button>
					<Button
						variant="outline"
						onPress={onResendVerification}
						disabled={isResending}
						className="w-full"
					>
						<Text>
							{isResending ? "Sending..." : "Resend verification email"}
						</Text>
					</Button>
					{hasResendSuccess && (
						<Text className="text-center text-sm text-green-600 dark:text-green-400">
							Verification email sent successfully!
						</Text>
					)}
					{hasResendError && (
						<Text className="text-center text-sm text-red-600 dark:text-red-400">
							Failed to send verification email. Please try again.
						</Text>
					)}
				</View>
			</View>
		</>
	);
}
