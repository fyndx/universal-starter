import Link from "next/link";
import { Github, Globe, Linkedin, Twitter } from "lucide-react";

const SECTIONS = [
	{
		title: "Product",
		links: [
			{ label: "Features", href: "/" },
			{ label: "Pricing", href: "/pricing" },
			{ label: "Documentation", href: "/about" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About", href: "/about" },
			{ label: "Blog", href: "/" },
			{ label: "Contact", href: "/" },
		],
	},
	{
		title: "Resources",
		links: [
			{ label: "Community", href: "/" },
			{ label: "Support", href: "/" },
			{ label: "Status", href: "/" },
		],
	},
];

export function MarketingFooter() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-border bg-background px-4 py-6">
			<div className="mx-auto max-w-7xl px-4">
				<div className="mb-6 flex flex-col flex-wrap items-start justify-between gap-6 lg:flex-row">
					<div className="min-w-48 flex-1">
						<Link href="/" className="mb-3 flex items-center gap-2">
							<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-base font-bold text-primary-foreground">
								⚡
							</span>
							<span className="text-lg font-semibold text-foreground">
								Universal Starter
							</span>
						</Link>
						<p className="text-sm leading-5 text-muted-foreground">
							A Next.js + React Native monorepo starter kit — built with
							Tailwind, Better Auth, and Elysia.
						</p>
						<div className="mt-4 flex gap-3">
							{[Twitter, Github, Linkedin, Globe].map((Icon, i) => (
								<Link
									key={i}
									href="/"
									className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground"
								>
									<Icon className="h-4 w-4" />
								</Link>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-4 lg:flex-row lg:gap-10">
						{SECTIONS.map((section) => (
							<div key={section.title} className="flex flex-col gap-3">
								<span className="text-sm font-medium text-foreground">
									{section.title}
								</span>
								<div className="flex flex-col gap-2">
									{section.links.map((link) => (
										<Link
											key={link.label}
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground"
										>
											{link.label}
										</Link>
									))}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="flex items-center justify-between gap-4 border-t border-border pt-6">
					<p className="text-xs text-muted-foreground">
						© {year} Universal Starter. All rights reserved.
					</p>
					<div className="flex gap-4">
						<Link
							href="/"
							className="text-muted-foreground hover:text-foreground"
						>
							<Globe className="h-4 w-4" />
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
