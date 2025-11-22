import { Redirect, Slot } from "expo-router";
import { Header } from "~/components/layouts/protected/Header";
import { LoadingScreen } from "~/containers/loading-screen";
import { authClient } from "~/lib/auth-client";

export default function ProtectedLayout() {
	const { isPending, data } = authClient.useSession();
	if (isPending) {
		// Wait for the authentication state to resolve
		return <LoadingScreen />;
	}

	if (!data) {
		return <Redirect href="/auth/sign-in" />;
	}

	return (
		<>
			<Header />
			<Slot />
		</>
	);
}
