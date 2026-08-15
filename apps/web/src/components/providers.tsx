"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

/**
 * Client-side providers shared across the whole app. Wraps everything in
 * next-themes (class-based dark mode, defaulting to dark to match the mobile
 * app) and mounts the Sonner toaster.
 */
export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem={false}
			disableTransitionOnChange
		>
			{children}
			<Toaster richColors closeButton position="bottom-center" />
		</NextThemesProvider>
	);
}
