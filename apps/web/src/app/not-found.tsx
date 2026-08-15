import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
			<h1 className="text-6xl font-bold text-foreground">404</h1>
			<p className="text-lg text-muted-foreground">
				The page you&apos;re looking for doesn&apos;t exist.
			</p>
			<Button asChild>
				<Link href="/">Go Home</Link>
			</Button>
		</div>
	);
}
