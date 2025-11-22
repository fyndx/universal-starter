import { useNavigation } from "expo-router";
import * as React from "react";
import { useEffect } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Text } from "~/components/ui/text";
import { HeaderUser } from "~/containers/core/HeaderUser";
import { Sparkles } from "~/lib/icons/Sparkles";

export function Header() {
	const [value, setValue] = React.useState<string>();
	const navigation = useNavigation();

	function closeAll() {
		setValue("");
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: `navigation` is stable
	useEffect(() => {
		const sub = navigation.addListener("blur", () => {
			closeAll();
		});

		return sub;
	}, []);

	return (
		<>
			{Platform.OS !== "web" && !!value && (
				<Pressable
					onPress={() => {
						setValue("");
					}}
					style={StyleSheet.absoluteFill}
				/>
			)}
			<View className="flex-row items-center justify-between px-4 py-0 border-b border-border bg-background relative z-50">
				{/* Logo Section */}
				<Pressable
					onPress={() => {
						// TODO: Navigate to home
					}}
					className="flex-row items-center gap-2"
				>
					<Sparkles size={24} className="text-primary" />
					<Text className="text-lg font-bold text-foreground">
						Universal Starter
					</Text>
				</Pressable>
				{/* Right Section - Theme Toggle & Login */}
				<View className="flex-row items-center gap-2">
					<ThemeToggle />
					<HeaderUser />
				</View>
			</View>
		</>
	);
}
