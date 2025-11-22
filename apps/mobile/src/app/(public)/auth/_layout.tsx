import { Redirect, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "~/components/layouts/default/Header";
import { authClient } from "~/lib/auth-client";

export default function AuthLayout() {
	const { isPending, data } = authClient.useSession();
	if (isPending) {
		// Wait for the authentication state to resolve
		return null;
	}
	if (data) {
		// If the user is authenticated, redirect to the protected area
		return <Redirect href="/home" />;
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Header />
			<Stack screenOptions={{ headerShown: false }} initialRouteName="sign-in">
				<Stack.Screen name="sign-in" />
				<Stack.Screen name="sign-up" />
				<Stack.Screen name="forgot-password" />
				<Stack.Screen name="social-sign-in" />
			</Stack>
		</SafeAreaView>
	);
}
