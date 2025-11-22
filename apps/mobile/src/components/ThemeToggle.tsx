import { useColorScheme } from "@/src/hooks/useColorScheme";
import { setAndroidNavigationBar } from "@/src/lib/android-navigation-bar";
import { MoonStar } from "@/src/lib/icons/MoonStar";
import { Sun } from "@/src/lib/icons/Sun";
import { Pressable, View } from "react-native";

export function ThemeToggle() {
	const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

	function handleToggleColorScheme() {
		toggleColorScheme();
		// Update Android navigation bar
		const newTheme = isDarkColorScheme ? "light" : "dark";
		setAndroidNavigationBar(newTheme);
	}

	return (
		<Pressable
			onPress={handleToggleColorScheme}
			className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 active:opacity-70"
		>
			<View className="flex-1 aspect-square pt-0.5 justify-center items-start web:px-5">
				{isDarkColorScheme ? (
					<MoonStar className="text-foreground" size={23} strokeWidth={1.25} />
				) : (
					<Sun className="text-foreground" size={24} strokeWidth={1.25} />
				)}
			</View>
		</Pressable>
	);
}
