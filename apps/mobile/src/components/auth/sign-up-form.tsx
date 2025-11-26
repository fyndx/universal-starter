import { Link } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator } from "~/components/ui/activity-indicator";
import { Button } from "~/components/ui/button";

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

  // Calculate score based on criteria met
  Object.values(checks).forEach((check) => {
    if (check) {
      score += 20;
    }
  });

  // Determine strength level and color
  if (score <= 20) {
    return { strength: score, label: "Very Weak", color: "text-red-500" };
  }
  if (score <= 40) {
    return { strength: score, label: "Weak", color: "text-orange-500" };
  }
  if (score <= 60) {
    return { strength: score, label: "Fair", color: "text-yellow-500" };
  }
  if (score <= 80) {
    return { strength: score, label: "Good", color: "text-blue-500" };
  }
  return { strength: score, label: "Strong", color: "text-green-500" };
}

type SignUpFormProps = {
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
};

export function SignUpForm({
  formData,
  isLoading,
  onFormDataChange,
  onSubmit,
}: SignUpFormProps) {
  const passwordStrength = calculatePasswordStrength(formData.password);

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="font-bold text-2xl">Create an account</Text>
        <Text className="text-muted-foreground">
          Enter your details to create a new account.
        </Text>
      </View>
      <View className="gap-4">
        <Input
          id="name"
          onChangeText={(value) => onFormDataChange({ field: "name", value })}
          placeholder="Full Name"
          value={formData.name}
        />
        <Input
          id="email"
          onChangeText={(value) => onFormDataChange({ field: "email", value })}
          placeholder="Email"
          value={formData.email}
        />
        <View className="gap-2">
          <PasswordInput
            id="password"
            onChangeText={(value) =>
              onFormDataChange({ field: "password", value })
            }
            placeholder="Password"
            value={formData.password}
          />
          {formData.password && (
            <View className="gap-2">
              <Progress
                className="h-2 web:w-full"
                value={passwordStrength.strength}
              />
              <Text className={`text-xs ${passwordStrength.color}`}>
                {passwordStrength.label}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View>
        <Button
          className="flex-row items-center gap-4"
          disabled={isLoading}
          onPress={onSubmit}
        >
          {isLoading && <ActivityIndicator />}
          <Text>{isLoading ? "Creating Account..." : "Sign Up"}</Text>
        </Button>
      </View>
      {/* Sign In Option */}
      <View className="p-6 pt-0">
        <View className="flex-row items-center justify-center">
          <Text className="text-muted-foreground text-sm">
            Already have an account?{" "}
          </Text>
          <Link asChild dismissTo href="/(public)/auth/sign-in">
            <Text className="font-medium text-primary text-sm hover:underline">
              Sign in
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
