import type { InstalledApp } from "@react-buoy/core";
import { Button, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeToggle } from "~/components/ThemeToggle";
import { MoonStar } from "~/lib/icons/MoonStar";

function ThemeToggleTool({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="items-center gap-5 p-5" style={{ paddingTop: insets.top }}>
      <Text className="font-bold text-foreground text-xl">Theme Settings</Text>
      <View className="flex-row items-center gap-5">
        <ThemeToggle />
      </View>
      <Button onPress={onClose} title="Close" />
    </View>
  );
}

export const customTools: InstalledApp[] = [
  {
    id: "theme-toggle",
    name: "Theme",
    description: "Toggle color scheme",
    slot: "both",
    icon: ({ size }) => <MoonStar size={size} />,
    component: ThemeToggleTool,
    props: {},
  },
];
