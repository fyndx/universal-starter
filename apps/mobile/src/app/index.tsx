import { Redirect } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, Text, View } from "react-native";
import { authClient } from "~/lib/auth-client";

export default function SplashScreen() {
  const session = authClient.useSession();

  // Hide splash screen once session is loaded (not pending)
  useEffect(() => {
    if (session.data !== undefined) {
      ExpoSplashScreen.hideAsync();
    }
  }, [session.data]);

  // Show loading state while session is pending for Mobile
  if (!session) {
    return (
      <View className="items-center gap-4">
        {/* Placeholder logo/icon */}
        <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center">
          <Text className="text-2xl font-bold text-primary-foreground">📱</Text>
        </View>
        <Text className="text-lg font-medium text-foreground">Loading...</Text>
      </View>
    );
  }

  if (session.data?.user) {
    // User is authenticated, redirect to home/tabs
    return <Redirect href="/(public)/(protected)/home/(tabs)" />;
  } else if (session.data === null) {
    // User is not authenticated, redirect to login
    return <Redirect href="/(public)/auth/sign-in" />;
  }
}
