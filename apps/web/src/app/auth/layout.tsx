"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { authClient } from "@/lib/auth-client";

/**
 * Auth layout — mirrors the mobile `(public)/auth/_layout`. While the session
 * is resolving we show a loader; once resolved, authenticated users are bounced
 * to the protected area.
 */
export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data, isPending } = authClient.useSession();
	const router = useRouter();

	useEffect(() => {
		if (!isPending && data) {
			router.replace("/home");
		}
	}, [data, isPending, router]);

	if (isPending || data) {
		return <LoadingScreen />;
	}

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex flex-1 flex-col">{children}</main>
		</div>
	);
}
