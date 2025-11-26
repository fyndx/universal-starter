import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { authClient } from "@/src/lib/auth-client";
import { Header } from "~/components/header";
import { Screen } from "~/components/screen";
import { ActivityIndicator } from "~/components/ui/activity-indicator";
import { Button } from "~/components/ui/button";
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
        }
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
    <Screen>
      <Header />
      <View className="flex-1 justify-center gap-6 p-6">
        <View className="gap-2">
          <Text className="font-bold text-2xl">Login to your account</Text>
          <Text className="text-muted-foreground">
            Enter your email and password to sign in.
          </Text>
        </View>
        <View className="gap-4">
          <Input
            id={"email"}
            onChangeText={setEmail}
            placeholder="Email"
            value={email}
          />
          <PasswordInput
            id={"password"}
            onChangeText={setPassword}
            placeholder="Password"
            value={password}
          />
          {/* Forgot Password */}
          <Link asChild href="/(public)/auth/forgot-password">
            <Text className="mt-2 self-end text-right text-muted-foreground text-sm hover:text-primary hover:underline">
              Forgot Password?
            </Text>
          </Link>
        </View>
        <View className="flex-col gap-3">
          <Button className="flex-row items-center gap-4" onPress={handleLogin}>
            {isLoading && <ActivityIndicator />}
            <Text>{isLoading ? "Signing In..." : "Sign In"}</Text>
          </Button>

          {showVerificationPrompt && (
            <View className="w-full">
              <Text className="mb-2 text-center text-muted-foreground text-sm">
                Email not verified? Check your inbox or resend verification.
              </Text>
              <Button
                className="flex-row items-center gap-2"
                disabled={isResendingVerification}
                onPress={handleResendVerification}
                variant="outline"
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
        </View>
        {/* Sign Up Option */}
        <View className="p-6 pt-0">
          <View className="flex-row items-center justify-center">
            <Text className="text-muted-foreground text-sm">
              Don't have an account?{" "}
            </Text>
            <Link asChild href="/(public)/auth/sign-up">
              <Text className="font-medium text-primary text-sm hover:underline">
                Sign up
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </Screen>
  );
}
