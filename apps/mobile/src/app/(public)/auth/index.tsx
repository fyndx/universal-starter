import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { authClient } from "@/src/lib/auth-client";
import { Header } from "~/components/header";
import { Screen } from "~/components/screen";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function AuthIndex() {
  const router = useRouter();

  const handleSocialLogin = async (
    provider: "google" | "facebook" | "github" | "apple" | "linkedin"
  ) => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
  };

  return (
    <Screen>
      <Header />
      <View className="w-full max-w-sm flex-1 justify-center gap-6 px-4">
        <View className="gap-2">
          <Text className="text-center font-bold text-2xl">Welcome</Text>
          <Text className="text-center text-muted-foreground">
            Sign in to continue
          </Text>
        </View>
        <View className="gap-4">
          <Button
            className="flex-row items-center gap-2"
            onPress={() => handleSocialLogin("google")}
            variant="outline"
          >
            <FontAwesome color="black" name="google" size={20} />
            <Text>Continue with Google</Text>
          </Button>
          <Button
            className="flex-row items-center gap-2"
            onPress={() => handleSocialLogin("facebook")}
            variant="outline"
          >
            <FontAwesome color="black" name="facebook" size={20} />
            <Text>Continue with Facebook</Text>
          </Button>
          <Button
            className="flex-row items-center gap-2"
            onPress={() => handleSocialLogin("github")}
            variant="outline"
          >
            <FontAwesome color="black" name="github" size={20} />
            <Text>Continue with Github</Text>
          </Button>
          <Button
            className="flex-row items-center gap-2"
            onPress={() => handleSocialLogin("apple")}
            variant="outline"
          >
            <FontAwesome color="black" name="apple" size={20} />
            <Text>Continue with Apple</Text>
          </Button>
          <Button
            className="flex-row items-center gap-2"
            onPress={() => handleSocialLogin("linkedin")}
            variant="outline"
          >
            <FontAwesome color="black" name="linkedin" size={20} />
            <Text>Continue with Linkedin</Text>
          </Button>

          <View className="py-2">
            <View className="flex items-center justify-center bg-background px-2 text-center">
              <Text className="text-muted-foreground text-xs">Or</Text>
            </View>
          </View>

          <Button
            className="flex-row items-center gap-2"
            onPress={() => router.push("/(public)/auth/sign-in")}
          >
            <Text>Continue with Email</Text>
          </Button>
        </View>
        <View className="justify-center">
          <Text className="text-center text-muted-foreground text-xs">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
