"use client";

import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

const OPTIONS = [{ label: "Admin", icon: Shield, path: "/admin/manage-users" }];

export function HeaderUser() {
	const { data, isPending } = authClient.useSession();
	const router = useRouter();

	if (isPending) {
		return (
			<div
				className="h-8 w-8 animate-pulse rounded-full bg-muted"
				aria-hidden
			/>
		);
	}

	if (!data) {
		return (
			<Button variant="outline" size="sm" onClick={() => router.push("/auth")}>
				Login
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					aria-label="Account menu"
				>
					<Avatar>
						{data.user.image ? (
							<AvatarImage
								src={data.user.image}
								alt={data.user.name ?? "User"}
							/>
						) : null}
						<AvatarFallback>{data.user.name?.charAt(0) ?? "U"}</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64">
				<DropdownMenuLabel className="flex flex-col items-start gap-0.5">
					<span className="font-semibold">{data.user.name}</span>
					<span className="text-sm font-normal text-muted-foreground">
						{data.user.email}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{OPTIONS.map((option) => (
					<DropdownMenuItem
						key={option.label}
						onClick={() => router.push(option.path)}
					>
						<option.icon className="h-4 w-4" />
						{option.label}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-destructive focus:text-destructive"
					onClick={() => {
						authClient.signOut();
						router.push("/auth");
					}}
				>
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
