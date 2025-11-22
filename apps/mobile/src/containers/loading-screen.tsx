import { Platform, View } from "react-native";
import { cn } from "~/lib/utils";
import { ActivityIndicator } from "../components/ui/activity-indicator";
import { Text } from "../components/ui/text";

interface LoadingScreenProps {
	message?: string;
	showSpinner?: boolean;
}

function LoadingScreen({
	message = "Loading...",
	showSpinner = true,
}: LoadingScreenProps) {
	return (
		<View
			className={cn(
				"flex-1 justify-center items-center bg-background",
				// Web-specific optimizations
				Platform.OS === "web" && "min-h-screen w-full",
				// Mobile-specific optimizations
				Platform.OS !== "web" && "absolute inset-0 z-50",
			)}
		>
			<View className="flex-col items-center justify-center space-y-4 p-6">
				{showSpinner && <ActivityIndicator size={"large"} className="mb-4" />}

				{message && (
					<Text
						className={cn(
							"text-center text-muted-foreground",
							// Responsive text sizing
							"text-base md:text-lg",
							// Platform-specific styling
							Platform.OS === "web" && "web:select-none",
							Platform.OS !== "web" && "native:text-lg",
						)}
					>
						{message}
					</Text>
				)}
			</View>
		</View>
	);
}

export { LoadingScreen, type LoadingScreenProps };
