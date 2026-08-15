import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Universal Starter",
	description:
		"The ultimate Next.js + React Native starter kit — powered by Tailwind, Better Auth, and Elysia.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen bg-background font-sans antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
