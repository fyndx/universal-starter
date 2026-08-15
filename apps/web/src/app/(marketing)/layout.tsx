import { MarketingHeader } from "@/components/layouts/marketing/header";
import { MarketingFooter } from "@/components/layouts/marketing/footer";

/**
 * Shared chrome for public marketing pages: `/`, `/about`, `/pricing`.
 */
export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col">
			<MarketingHeader />
			<main className="flex-1">{children}</main>
			<MarketingFooter />
		</div>
	);
}
