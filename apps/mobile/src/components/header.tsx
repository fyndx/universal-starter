import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export function Header() {
  const router = useRouter();

  return (
    <View className="flex-row">
      {router.canGoBack() && (
        <Button onPress={() => router.back()} variant="ghost">
          <Icon as={ChevronLeft} className="size-6" />
        </Button>
      )}
    </View>
  );
}
