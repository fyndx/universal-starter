"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { ProtectedHeader } from "@/components/layouts/protected/header";
import { authClient } from "@/lib/auth-client";

/**
 * Protected layout — mirrors the mobile `(public)/(protected)/_layout`.
 * Redirects unauthenticated visitors to `/auth`.
 */
export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data, isPending } = authClient.useSession();
	const router = useRouter();

	useEffect(() => {
		if (!isPending && !data) {
			router.replace("/auth");
		}
	}, [data, isPending, router]);

	if (isPending || !data) {
		return <LoadingScreen />;
	}

	return (
		<div className="flex min-h-screen flex-col">
			<ProtectedHeader />
			<main className="flex flex-1 flex-col">{children}</main>
		</div>
	);
}
