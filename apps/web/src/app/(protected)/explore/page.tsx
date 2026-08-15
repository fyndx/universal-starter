import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function ExplorePage() {
	return (
		<div className="flex-1 bg-background p-4 sm:p-6">
			<div className="mx-auto max-w-4xl">
				<Card>
					<CardHeader>
						<CardTitle>Explore</CardTitle>
						<CardDescription>
							Discover what Universal Starter offers.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							This is the Explore screen. Add your discovery feed, search, or
							onboarding content here.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
