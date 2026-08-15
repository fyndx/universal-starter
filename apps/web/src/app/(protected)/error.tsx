"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProtectedError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
			<h2 className="text-2xl font-bold text-foreground">
				Something went wrong
			</h2>
			<p className="max-w-md text-muted-foreground">
				An error occurred while loading your dashboard. Please try again or go
				back home.
			</p>
			<div className="flex gap-2">
				<Button onClick={reset}>Try again</Button>
				<Button asChild variant="outline">
					<Link href="/">Go Home</Link>
				</Button>
			</div>
		</div>
	);
}
