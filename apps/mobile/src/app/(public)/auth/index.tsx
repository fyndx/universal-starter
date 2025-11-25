import { authClient } from "@/src/lib/auth-client";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
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
    <Screen className="flex-1 justify-center items-center p-4">
      {router.canGoBack() && (
        <Button
          variant="ghost"
          className="absolute top-4 left-4 z-10"
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} className="text-foreground" />
        </Button>
      )}
      <View className="w-full max-w-sm gap-6">
        <View className="gap-2">
          <Text className="text-center text-2xl font-bold">Welcome</Text>
          <Text className="text-center text-muted-foreground">
            Sign in to continue
          </Text>
        </View>
        <View className="gap-4">
          <Button
            variant="outline"
            onPress={() => handleSocialLogin("google")}
            className="flex-row items-center gap-2"
          >
            <FontAwesome name="google" size={20} color="black" />
            <Text>Continue with Google</Text>
          </Button>
          <Button
            variant="outline"
            onPress={() => handleSocialLogin("facebook")}
            className="flex-row items-center gap-2"
          >
            <FontAwesome name="facebook" size={20} color="black" />
            <Text>Continue with Facebook</Text>
          </Button>
          <Button
            variant="outline"
            onPress={() => handleSocialLogin("github")}
            className="flex-row items-center gap-2"
          >
            <FontAwesome name="github" size={20} color="black" />
            <Text>Continue with Github</Text>
          </Button>
          <Button
            variant="outline"
            onPress={() => handleSocialLogin("apple")}
            className="flex-row items-center gap-2"
          >
            <FontAwesome name="apple" size={20} color="black" />
            <Text>Continue with Apple</Text>
          </Button>
          <Button
            variant="outline"
            onPress={() => handleSocialLogin("linkedin")}
            className="flex-row items-center gap-2"
          >
            <FontAwesome name="linkedin" size={20} color="black" />
            <Text>Continue with Linkedin</Text>
          </Button>

          <View className="py-2">
            <View className="flex items-center justify-center text-center bg-background px-2">
              <Text className="text-muted-foreground text-xs">Or</Text>
            </View>
          </View>

          <Button
            onPress={() => router.push("/(public)/auth/sign-in")}
            className="flex-row items-center gap-2"
          >
            <Text>Continue with Email</Text>
          </Button>
        </View>
        <View className="justify-center">
          <Text className="text-xs text-muted-foreground text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
