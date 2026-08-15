"use client";

import { Button } from "@/components/ui/button";

export default function MarketingError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
			<h2 className="text-2xl font-bold text-foreground">Page Error</h2>
			<p className="max-w-md text-muted-foreground">
				We couldn&apos;t load this page. Please try again.
			</p>
			<Button onClick={reset}>Try again</Button>
		</div>
	);
}
