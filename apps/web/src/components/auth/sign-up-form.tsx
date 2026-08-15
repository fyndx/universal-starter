"use client";

import Link from "next/link";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password";
import { Progress } from "@/components/ui/progress";

function calculatePasswordStrength(password: string): {
	strength: number;
	label: string;
	color: string;
} {
	if (!password) {
		return { strength: 0, label: "", color: "" };
	}

	let score = 0;
	const checks = {
		length: password.length >= 8,
		lowercase: /[a-z]/.test(password),
		uppercase: /[A-Z]/.test(password),
		numbers: /\d/.test(password),
		symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
	};

	Object.values(checks).forEach((check) => {
		if (check) score += 20;
	});

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

export interface SignUpFormData {
	name: string;
	email: string;
	password: string;
}

export function SignUpForm({
	formData,
	isLoading,
	onFormDataChange,
	onSubmit,
}: {
	formData: SignUpFormData;
	isLoading: boolean;
	onFormDataChange: (field: keyof SignUpFormData, value: string) => void;
	onSubmit: () => void;
}) {
	const passwordStrength = calculatePasswordStrength(formData.password);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold">Create an account</h1>
				<p className="text-muted-foreground">
					Enter your details to create a new account.
				</p>
			</div>
			<div className="flex flex-col gap-4">
				<Input
					id="name"
					placeholder="Full Name"
					value={formData.name}
					onChange={(e) => onFormDataChange("name", e.target.value)}
				/>
				<Input
					id="email"
					type="email"
					placeholder="Email"
					value={formData.email}
					onChange={(e) => onFormDataChange("email", e.target.value)}
				/>
				<div className="flex flex-col gap-2">
					<PasswordInput
						id="password"
						placeholder="Password"
						value={formData.password}
						onChange={(e) => onFormDataChange("password", e.target.value)}
					/>
					{formData.password && (
						<div className="flex flex-col gap-2">
							<Progress value={passwordStrength.strength} />
							<span className={`text-xs ${passwordStrength.color}`}>
								{passwordStrength.label}
							</span>
						</div>
					)}
				</div>
			</div>
			<Button className="w-full" disabled={isLoading} onClick={onSubmit}>
				{isLoading && <ActivityIndicator />}
				{isLoading ? "Creating Account..." : "Sign Up"}
			</Button>
			<div className="flex items-center justify-center">
				<span className="text-sm text-muted-foreground">
					Already have an account?{" "}
				</span>
				<Link
					href="/auth/sign-in"
					className="text-sm font-medium text-primary hover:underline"
				>
					Sign in
				</Link>
			</div>
		</div>
	);
}
