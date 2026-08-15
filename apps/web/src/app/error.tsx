"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("[web] Route error:", error);
	}, [error]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
			<h2 className="text-2xl font-bold text-foreground">
				Something went wrong
			</h2>
			<p className="max-w-md text-muted-foreground">
				An unexpected error occurred. You can try again, or contact support if
				the problem persists.
			</p>
			{error.digest && (
				<p className="text-xs text-muted-foreground">
					Error ID: {error.digest}
				</p>
			)}
			<Button onClick={reset}>Try again</Button>
		</div>
	);
}
