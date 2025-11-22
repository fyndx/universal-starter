import { observer } from "@legendapp/state/react";
import { MotiView } from "moti";
import { View } from "react-native";
import { SignUpForm } from "~/components/auth/sign-up-form";
import { SignUpSuccessCard } from "~/components/auth/sign-up-success-card";
import { signUpModel$ } from "~/models/auth/sign-up.model";

export const SignUpContainer = observer(() => {
	const { status, formData } = signUpModel$.obs.get();
	const resendVerificationStatus =
		signUpModel$.emailModel.obs.resendVerificationStatus.get();

	const handleFormDataChange = ({
		field,
		value,
	}: {
		field: string;
		value: string;
	}) => {
		signUpModel$.updateFormData({ field, value });
	};

	const handleSignUp = async () => {
		await signUpModel$.signUp();
	};

	const handleContinue = () => {
		signUpModel$.continueToApp();
	};

	const handleResendVerification = async () => {
		await signUpModel$.resendVerification();
	};

	return (
		<View className="flex-1 justify-center items-center">
			<View className="w-full max-w-sm">
				<MotiView
					from={{ opacity: 0, translateY: -20 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{ type: "timing", duration: 300 }}
				>
					{status === "success" ? (
						<SignUpSuccessCard
							userName={formData.name}
							userEmail={formData.email}
							onContinue={handleContinue}
							onResendVerification={handleResendVerification}
							resendVerificationStatus={resendVerificationStatus}
						/>
					) : (
						<SignUpForm
							formData={formData}
							isLoading={status === "loading"}
							onFormDataChange={handleFormDataChange}
							onSubmit={handleSignUp}
						/>
					)}
				</MotiView>
			</View>
		</View>
	);
});
