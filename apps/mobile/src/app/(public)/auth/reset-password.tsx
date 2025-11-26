import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { authClient } from "@/src/lib/auth-client";
import { Header } from "~/components/header";
import { Screen } from "~/components/screen";
import { ActivityIndicator } from "~/components/ui/activity-indicator";
import { Button } from "~/components/ui/button";
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
      resetToken =
        new URLSearchParams(window.location?.search).get("token") || "";
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
        }
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
      <Screen className="items-center justify-center">
        <View className="w-full max-w-sm p-6">
          <Text className="text-center text-muted-foreground">Loading...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header />
      <View className="w-full max-w-sm flex-1 justify-center gap-6 p-6">
        <View className="gap-2">
          <Text className="font-bold text-2xl">Reset Your Password</Text>
          <Text className="text-muted-foreground">
            Enter your new password below.
          </Text>
        </View>
        <View className="gap-4">
          <PasswordInput
            id={"newPassword"}
            onChangeText={setNewPassword}
            placeholder="New Password"
            value={newPassword}
          />
          <PasswordInput
            id={"confirmPassword"}
            onChangeText={setConfirmPassword}
            placeholder="Confirm New Password"
            value={confirmPassword}
          />
        </View>
        <View>
          <Button
            className="flex-row items-center gap-4"
            disabled={!(newPassword && confirmPassword) || isLoading}
            onPress={handleResetPassword}
          >
            {isLoading && <ActivityIndicator />}
            <Text>{isLoading ? "Resetting..." : "Reset Password"}</Text>
          </Button>
        </View>
        {/* Back to Sign In */}
        <View className="p-6 pt-0">
          <View className="flex-row items-center justify-center">
            <Text className="text-muted-foreground text-sm">
              Remember your password?{" "}
            </Text>
            <Link asChild href="/(public)/auth/sign-in">
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
