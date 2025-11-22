import { Redirect } from "expo-router";

// Make /auth index redirect to sign-in page
// This is useful for when you want to have a landing page for authentication
// that redirects to the sign-in page.
export default function AuthIndex() {
	return <Redirect href="/(public)/auth/sign-in" />;
}
