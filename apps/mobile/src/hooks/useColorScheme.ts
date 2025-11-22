import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useCallback, useEffect, useState } from "react";
import { storage } from "../lib/storage";

export type ColorScheme = "light" | "dark" | "system";

const COLOR_SCHEME_STORAGE_KEY = "color-scheme";

export function useColorScheme() {
	const { colorScheme, setColorScheme: setNativewindColorScheme } =
		useNativewindColorScheme();
	const [isLoaded, setIsLoaded] = useState(false);

	// Load stored color scheme on mount
	useEffect(() => {
		const loadStoredColorScheme = async () => {
			try {
				const storedValue = await storage.getItem(COLOR_SCHEME_STORAGE_KEY);
				if (storedValue && ["light", "dark", "system"].includes(storedValue)) {
					const storedColorScheme = storedValue as ColorScheme;
					if (storedColorScheme !== colorScheme) {
						setNativewindColorScheme(storedColorScheme);
					}
				}
			} catch (error) {
				console.error("Error loading stored color scheme:", error);
			} finally {
				setIsLoaded(true);
			}
		};

		loadStoredColorScheme();
	}, [colorScheme, setNativewindColorScheme]);

	// Enhanced setColorScheme that persists to storage
	const setColorScheme = useCallback(
		async (newColorScheme: ColorScheme) => {
			try {
				await storage.setItem(COLOR_SCHEME_STORAGE_KEY, newColorScheme);
				setNativewindColorScheme(newColorScheme);
			} catch (error) {
				console.error("Error saving color scheme:", error);
				// Still set the theme even if storage fails
				setNativewindColorScheme(newColorScheme);
			}
		},
		[setNativewindColorScheme],
	);

	// Enhanced toggleColorScheme that persists to storage
	const toggleColorScheme = useCallback(async () => {
		const currentScheme = colorScheme ?? "dark";
		const newScheme: ColorScheme = currentScheme === "dark" ? "light" : "dark";
		await setColorScheme(newScheme);
	}, [colorScheme, setColorScheme]);

	return {
		colorScheme: colorScheme ?? "dark",
		isDarkColorScheme: colorScheme === "dark",
		setColorScheme,
		toggleColorScheme,
		isLoaded,
	};
}
