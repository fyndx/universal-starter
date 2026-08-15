"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
	const { data: session } = authClient.useSession();

	return (
		<div className="flex-1 bg-background p-4 sm:p-6">
			<div className="mx-auto max-w-4xl">
				<h1 className="mb-6 text-2xl font-bold text-foreground">
					Welcome, {session?.user.email ?? "User"}
				</h1>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Dashboard</CardTitle>
							<CardDescription>Your authenticated home screen.</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Signed in as{" "}
								<span className="font-medium text-foreground">
									{session?.user.name ?? session?.user.email}
								</span>
								.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Explore</CardTitle>
							<CardDescription>Browse the app.</CardDescription>
						</CardHeader>
						<CardContent>
							<Button asChild variant="outline">
								<Link href="/explore">Go to Explore</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
