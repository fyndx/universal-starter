import { Link } from "expo-router";
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
import { Progress } from "~/components/ui/progress";
import { Text } from "~/components/ui/text";

// Password strength calculation
function calculatePasswordStrength(password: string): {
	strength: number;
	label: string;
	color: string;
} {
	if (!password) return { strength: 0, label: "", color: "" };

	let score = 0;
	const checks = {
		length: password.length >= 8,
		lowercase: /[a-z]/.test(password),
		uppercase: /[A-Z]/.test(password),
		numbers: /\d/.test(password),
		symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
	};

	// Calculate score based on criteria met
	Object.values(checks).forEach((check) => {
		if (check) score += 20;
	});

	// Determine strength level and color
	if (score <= 20)
		return { strength: score, label: "Very Weak", color: "text-red-500" };
	if (score <= 40)
		return { strength: score, label: "Weak", color: "text-orange-500" };
	if (score <= 60)
		return { strength: score, label: "Fair", color: "text-yellow-500" };
	if (score <= 80)
		return { strength: score, label: "Good", color: "text-blue-500" };
	return { strength: score, label: "Strong", color: "text-green-500" };
}

interface SignUpFormProps {
	formData: {
		name: string;
		email: string;
		password: string;
	};
	isLoading: boolean;
	onFormDataChange: ({
		field,
		value,
	}: {
		field: string;
		value: string;
	}) => void;
	onSubmit: () => void;
}

export function SignUpForm({
	formData,
	isLoading,
	onFormDataChange,
	onSubmit,
}: SignUpFormProps) {
	const passwordStrength = calculatePasswordStrength(formData.password);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your details to create a new account.
				</CardDescription>
			</CardHeader>
			<CardContent className="gap-4">
				<Input
					id="name"
					placeholder="Full Name"
					value={formData.name}
					onChangeText={(value) => onFormDataChange({ field: "name", value })}
				/>
				<Input
					id="email"
					placeholder="Email"
					value={formData.email}
					onChangeText={(value) => onFormDataChange({ field: "email", value })}
				/>
				<View className="gap-2">
					<PasswordInput
						id="password"
						placeholder="Password"
						value={formData.password}
						onChangeText={(value) =>
							onFormDataChange({ field: "password", value })
						}
					/>
					{formData.password && (
						<View className="gap-2">
							<Progress
								value={passwordStrength.strength}
								className="web:w-full h-2"
							/>
							<Text className={`text-xs ${passwordStrength.color}`}>
								{passwordStrength.label}
							</Text>
						</View>
					)}
				</View>
			</CardContent>
			<CardFooter>
				<Button
					onPress={onSubmit}
					className="flex-1 flex-row items-center gap-4"
					disabled={isLoading}
				>
					{isLoading && <ActivityIndicator />}
					<Text>{isLoading ? "Creating Account..." : "Sign Up"}</Text>
				</Button>
			</CardFooter>
			{/* Sign In Option */}
			<View className="p-6 pt-0">
				<View className="flex-row justify-center items-center">
					<Text className="text-sm text-muted-foreground">
						Already have an account?{" "}
					</Text>
					<Link href="/(public)/auth/sign-in">
						<Text className="text-sm text-primary hover:underline font-medium">
							Sign in
						</Text>
					</Link>
				</View>
			</View>
		</Card>
	);
}
