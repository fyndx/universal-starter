"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function AdminDashboardPage() {
	return (
		<div className="flex-1 bg-background p-4 sm:p-6">
			<div className="mx-auto max-w-2xl">
				<Card>
					<CardHeader>
						<CardTitle>Admin Dashboard</CardTitle>
						<CardDescription>Manage users and system settings</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<Button asChild className="w-full">
							<Link href="/admin/add-user">Add User</Link>
						</Button>
						<Button asChild variant="outline" className="w-full">
							<Link href="/admin/manage-users">Manage Users</Link>
						</Button>
						<Button variant="outline" disabled className="w-full">
							System Settings (Coming Soon)
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
