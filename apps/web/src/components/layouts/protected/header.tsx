import Link from "next/link";
import { Sparkles } from "lucide-react";
import { HeaderUser } from "@/components/header-user";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
	{ href: "/home", label: "Home" },
	{ href: "/explore", label: "Explore" },
];

export function ProtectedHeader() {
	return (
		<header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4">
			<div className="flex items-center gap-6">
				<Link href="/home" className="flex items-center gap-2">
					<Sparkles className="h-6 w-6 text-primary" />
					<span className="text-lg font-bold text-foreground">
						Universal Starter
					</span>
				</Link>
				<nav className="hidden items-center gap-1 sm:flex">
					{NAV_LINKS.map((link) => (
						<Button key={link.href} asChild variant="ghost" size="sm">
							<Link href={link.href}>{link.label}</Link>
						</Button>
					))}
				</nav>
			</div>
			<div className="flex items-center gap-2">
				<ThemeToggle />
				<HeaderUser />
			</div>
		</header>
	);
}
