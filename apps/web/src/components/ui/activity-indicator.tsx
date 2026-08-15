import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Spinner matching the mobile `ActivityIndicator`. */
export function ActivityIndicator({
	className,
	size = 16,
}: {
	className?: string;
	size?: number;
}) {
	return (
		<Loader2
			className={cn("animate-spin", className)}
			size={size}
			aria-hidden
		/>
	);
}
