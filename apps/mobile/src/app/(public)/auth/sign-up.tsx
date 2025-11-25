import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { SignUpContainer } from "~/containers/auth/sign-up.container";

export default function SignUp() {
  const router = useRouter();
  return (
    <View className="flex-1 p-4">
      {router.canGoBack() && (
        <Button
          variant="ghost"
          className="absolute top-0 left-0 z-10"
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} className="text-foreground" />
        </Button>
      )}
      <SignUpContainer />
    </View>
  );
}
