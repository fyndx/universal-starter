"use client";

import { Button } from "@/components/ui/button";

export default function AuthError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
			<h2 className="text-2xl font-bold text-foreground">
				Authentication Error
			</h2>
			<p className="max-w-md text-muted-foreground">
				Something went wrong on the authentication page. Please try again.
			</p>
			<Button onClick={reset}>Try again</Button>
		</div>
	);
}
