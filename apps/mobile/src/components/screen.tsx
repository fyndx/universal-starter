import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "~/lib/utils";

export const Screen = ({ children, className }: { children: React.ReactNode, className?: string }) => {
	return <SafeAreaView className={cn("flex-1", className)}>{children}</SafeAreaView>;
};