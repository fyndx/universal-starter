import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useIsomorphicLayoutEffect } from "@/src/hooks/useIsomorphicLayout";
import { NAV_THEME } from "@/src/lib/constants";
import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useRef } from "react";
import { Appearance, Platform } from "react-native";
import { setAndroidNavigationBar } from "../lib/android-navigation-bar";

const LIGHT_THEME: Theme = { ...DefaultTheme, colors: NAV_THEME.light };
const DARK_THEME: Theme = { ...DarkTheme, colors: NAV_THEME.dark };

export function useAppSetup() {
	const hasMounted = useRef(false);

	// 1. load fonts
	const [fontsLoaded] = useFonts({
		SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
	});

	// 2. load persisted color‐scheme
	const { isDarkColorScheme, isLoaded: schemeLoaded } = useColorScheme();

	// 3. platform side‐effects
	useIsomorphicLayoutEffect(() => {
		if (hasMounted.current) {
			return;
		}

		if (Platform.OS === "web") {
			document.documentElement.classList.add("bg-background");
		}
		if (Platform.OS === "android") {
			setAndroidNavigationBar(Appearance.getColorScheme() ?? "light");
		}
		hasMounted.current = true;
	}, []);

	const ready = fontsLoaded && schemeLoaded;
	return {
		ready,
		theme: isDarkColorScheme ? DARK_THEME : LIGHT_THEME,
		statusBarStyle: isDarkColorScheme ? "light" : "dark",
	} as const;
}
