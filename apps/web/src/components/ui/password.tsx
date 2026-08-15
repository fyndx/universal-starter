"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordInputProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"type"
> {}

/**
 * Password input with a show/hide toggle. Mirrors the mobile `PasswordInput`.
 */
export const PasswordInput = React.forwardRef<
	HTMLInputElement,
	PasswordInputProps
>(({ className, ...props }, ref) => {
	const [show, setShow] = React.useState(false);
	return (
		<div className="relative">
			<Input
				ref={ref}
				type={show ? "text" : "password"}
				className={cn("pr-9", className)}
				{...props}
			/>
			<button
				type="button"
				onClick={() => setShow((s) => !s)}
				className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
				tabIndex={-1}
				aria-label={show ? "Hide password" : "Show password"}
			>
				{show ? <EyeOff size={16} /> : <Eye size={16} />}
			</button>
		</div>
	);
});
PasswordInput.displayName = "PasswordInput";
