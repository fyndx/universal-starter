import { ActivityIndicator } from "@/components/ui/activity-indicator";

export function LoadingScreen() {
	return (
		<div className="flex flex-1 items-center justify-center gap-4 p-8">
			<ActivityIndicator size={24} />
			<span className="text-muted-foreground">Loading...</span>
		</div>
	);
}
