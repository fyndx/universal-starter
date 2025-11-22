import { authClient } from "@/src/lib/auth-client";
import { Button } from "react-native";

export default function SocialSignIn() {
	const handleLogin = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "/dashboard", // this will be converted to a deep link (eg. `myapp://dashboard`) on native
		});
	};
	return <Button title="Login with Google" onPress={handleLogin} />;
}
