"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type UserRole = "user" | "admin";

export default function AddUserPage() {
	const router = useRouter();
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		role: "user" as UserRole,
		autoVerify: false,
	});
	const [status, setStatus] = useState<"idle" | "loading">("idle");
	const [error, setError] = useState<string | null>(null);

	const updateForm = (updates: Partial<typeof form>) => {
		setForm((prev) => ({ ...prev, ...updates }));
		if (error) setError(null);
	};

	const handleSubmit = async () => {
		if (!form.name || !form.email || !form.password) {
			setError("Please fill in all required fields");
			toast.error("Please fill in all required fields");
			return;
		}
		setStatus("loading");
		try {
			const { error: apiError } = await authClient.admin.createUser({
				email: form.email,
				password: form.password,
				name: form.name,
				role: form.role,
				data: { autoVerify: form.autoVerify },
			});
			if (apiError) {
				throw new Error(apiError.message || "Failed to create user");
			}
			toast.success("User created successfully");
			router.back();
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to create user";
			setError(message);
			toast.error(message);
		} finally {
			setStatus("idle");
		}
	};

	const isLoading = status === "loading";

	return (
		<div className="flex-1 bg-background p-4 sm:p-6">
			<div className="mx-auto max-w-2xl">
				<Card>
					<CardHeader>
						<CardTitle>Add New User</CardTitle>
						<CardDescription>
							Create a new user account with the specified details
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Name *</Label>
							<Input
								id="name"
								placeholder="Enter user's full name"
								value={form.name}
								onChange={(e) => updateForm({ name: e.target.value })}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email *</Label>
							<Input
								id="email"
								type="email"
								autoCapitalize="none"
								placeholder="Enter email address"
								value={form.email}
								onChange={(e) => updateForm({ email: e.target.value })}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="password">Password *</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter password"
								value={form.password}
								onChange={(e) => updateForm({ password: e.target.value })}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="role">Role</Label>
							<Select
								value={form.role}
								onValueChange={(value) =>
									updateForm({ role: value as UserRole })
								}
							>
								<SelectTrigger id="role">
									<SelectValue placeholder="Select user role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="user">User</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-3">
							<div className="flex-1 pr-4">
								<Label htmlFor="autoVerify">Auto-verify email</Label>
								<p className="text-sm text-muted-foreground">
									Skip email verification for this user
								</p>
							</div>
							<Switch
								id="autoVerify"
								checked={form.autoVerify}
								onCheckedChange={(checked) =>
									updateForm({ autoVerify: checked })
								}
							/>
						</div>

						<div className="flex flex-col gap-3 pt-6 sm:flex-row sm:gap-4">
							<Button
								variant="outline"
								className="flex-1"
								onClick={() => router.back()}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								className="flex-1"
								onClick={handleSubmit}
								disabled={isLoading}
							>
								{isLoading && <ActivityIndicator />}
								{isLoading ? "Creating..." : "Create User"}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
