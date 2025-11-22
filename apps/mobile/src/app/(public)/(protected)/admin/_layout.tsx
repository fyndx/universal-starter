import { Redirect, Stack } from "expo-router";
import { LoadingScreen } from "~/containers/loading-screen";
import { authClient } from "~/lib/auth-client";

export default function AdminLayout() {
	const { isPending, data } = authClient.useSession();
	if (isPending) {
		// Wait for the authentication state to resolve
		return <LoadingScreen />;
	}

	if (!data) {
		return <Redirect href="/auth/sign-in" />;
	}

	if (data?.user.role !== "admin") {
		return <Redirect href="/home" />;
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="index"
				options={{
					title: "Admin Dashboard",
					headerStyle: {
						backgroundColor: "#f8fafc",
					},
				}}
			/>
			<Stack.Screen
				name="add-user"
				options={{
					title: "Add User",
					presentation: "modal",
					headerStyle: {
						backgroundColor: "#f8fafc",
					},
				}}
			/>
		</Stack>
	);
}
