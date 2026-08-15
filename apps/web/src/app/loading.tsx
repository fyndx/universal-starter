import { ActivityIndicator } from "@/components/ui/activity-indicator";

export default function Loading() {
	return (
		<div className="flex flex-1 items-center justify-center gap-3 p-16">
			<ActivityIndicator size={24} />
			<span className="text-muted-foreground">Loading...</span>
		</div>
	);
}
