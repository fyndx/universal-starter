"use client";

import { cn } from "@/lib/utils";

/**
 * Page container that mirrors the mobile `Screen` component: full-height,
 * safe-area-friendly, centered content. On the web we don't need the
 * KeyboardAvoidingView/SafeAreaView machinery, so this is a thin wrapper.
 */
export function Screen({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<main
			className={cn(
				"flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col",
				className,
			)}
		>
			{children}
		</main>
	);
}
