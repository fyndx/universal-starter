import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight typography helper kept for parity with the mobile `Text`
 * component. Renders as a <p> by default; pass `as` to override.
 */
type TextProps = React.HTMLAttributes<HTMLElement> & {
	as?: keyof React.JSX.IntrinsicElements;
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
	({ className, as: Comp = "p", ...props }, ref) => {
		const Tag = Comp as React.ElementType;
		return <Tag ref={ref} className={cn(className)} {...props} />;
	},
);
Text.displayName = "Text";
