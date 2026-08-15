"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { authClient } from "@/lib/auth-client";

/**
 * Admin layout — mirrors the mobile admin `_layout`. Requires an authenticated
 * user with the `admin` role; otherwise redirects to `/home`.
 */
export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data, isPending } = authClient.useSession();
	const router = useRouter();

	useEffect(() => {
		if (isPending) return;
		if (!data) {
			router.replace("/auth");
			return;
		}
		if (data.user.role !== "admin") {
			router.replace("/home");
		}
	}, [data, isPending, router]);

	if (isPending || !data || data.user.role !== "admin") {
		return <LoadingScreen />;
	}

	return <>{children}</>;
}
