import { Redirect, Stack } from "expo-router";
import { authClient } from "~/lib/auth-client";

export default function AuthLayout() {
	const { isPending, data } = authClient.useSession();
	if (isPending) {
		// Wait for the authentication state to resolve
		return null;
	}
	if (data) {
		// If the user is authenticated, redirect to the protected area
		return <Redirect href="/(public)/(protected)/home/(tabs)" />;
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
			<Stack.Screen name="sign-in" />
			<Stack.Screen name="sign-up" />
			<Stack.Screen name="forgot-password" />
		</Stack>
	);
}
