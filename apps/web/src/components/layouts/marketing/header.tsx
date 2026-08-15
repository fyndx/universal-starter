"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { HeaderUser } from "@/components/header-user";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
	{ href: "/about", label: "About" },
	{ href: "/pricing", label: "Pricing" },
];

export function MarketingHeader() {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
				<Link href="/" className="flex items-center gap-2">
					<Sparkles className="h-6 w-6 text-primary" />
					<span className="text-lg font-bold text-foreground">
						Universal Starter
					</span>
				</Link>

				<nav className="hidden items-center gap-1 md:flex">
					{NAV_LINKS.map((link) => (
						<Button key={link.href} asChild variant="ghost" size="sm">
							<Link href={link.href}>{link.label}</Link>
						</Button>
					))}
					<Button asChild size="sm" className="ml-2">
						<Link href="/auth/sign-up">Get Started</Link>
					</Button>
				</nav>

				<div className="flex items-center gap-2">
					<ThemeToggle />
					<div className="hidden md:block">
						<HeaderUser />
					</div>
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Open menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-72">
							<SheetHeader>
								<SheetTitle>Navigation</SheetTitle>
							</SheetHeader>
							<nav className="mt-6 flex flex-col gap-2">
								{NAV_LINKS.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										onClick={() => setOpen(false)}
										className={cn(
											"rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
											pathname === link.href && "bg-accent",
										)}
									>
										{link.label}
									</Link>
								))}
								<Button asChild className="mt-2">
									<Link href="/auth/sign-up" onClick={() => setOpen(false)}>
										Get Started
									</Link>
								</Button>
								<div className="mt-4 border-t pt-4">
									<HeaderUser />
								</div>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
