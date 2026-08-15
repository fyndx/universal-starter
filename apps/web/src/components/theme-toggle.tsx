"use client";

import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	function handleToggle() {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={handleToggle}
			aria-label="Toggle theme"
		>
			{resolvedTheme === "dark" ? (
				<MoonStar className="h-5 w-5" strokeWidth={1.25} />
			) : (
				<Sun className="h-5 w-5" strokeWidth={1.25} />
			)}
		</Button>
	);
}
