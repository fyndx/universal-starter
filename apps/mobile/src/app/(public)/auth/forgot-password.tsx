import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { Platform, View } from "react-native";
import { Screen } from "~/components/screen";
import { ActivityIndicator } from "~/components/ui/activity-indicator";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { authClient } from "~/lib/auth-client";
import { toast } from "~/lib/sonner/sonner";

export default function ForgotPassword() {
  const router = useRouter();
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
        }
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
      <View className="flex-row">
        {router.canGoBack() && (
          <Button
            variant="ghost"
            onPress={() => router.back()}
        >
          <ChevronLeft size={24} className="text-foreground" />
        </Button>
      )}
      </View>
      <View className="flex-1 w-full max-w-sm gap-6 p-6 justify-center">
        <View className="gap-2">
          <Text className="text-2xl font-bold">Reset your password</Text>
          <Text className="text-muted-foreground">
            Enter your email address and we'll send you instructions to reset
            your password.
          </Text>
        </View>
        <View className="gap-4">
          <Input
            id={"email"}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View>
          <Button
            onPress={handleResetPassword}
            className="flex-row items-center gap-4"
          >
            {isLoading && <ActivityIndicator />}
            <Text>{isLoading ? "Sending..." : "Reset Password"}</Text>
          </Button>
        </View>
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
      </View>
    </Screen>
  );
}
