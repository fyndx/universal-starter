"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Key, Mail, Trash2, UserCheck } from "lucide-react";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { getErrorMessage } from "@/lib/error";
import type { ApiStatus } from "@/lib/api-status";
import { toast } from "sonner";

interface AdminUser {
	id: string;
	email: string;
	name?: string;
	banned?: boolean;
	banReason?: string;
	banExpires?: string;
	lastLogin?: string;
	role?: string;
	emailVerified?: boolean;
	createdAt: Date | string;
	updatedAt?: Date | string;
}

interface SessionRow {
	id: string;
	token: string;
	device?: string;
	location?: string;
	lastActive?: string;
	current?: boolean;
	expired?: boolean;
}

const ROLE_OPTIONS = [
	{ label: "User", value: "user" },
	{ label: "Admin", value: "admin" },
];

const BAN_DURATIONS = [
	{ label: "1 day", value: "1" },
	{ label: "3 days", value: "3" },
	{ label: "7 days", value: "7" },
	{ label: "14 days", value: "14" },
	{ label: "30 days", value: "30" },
	{ label: "90 days", value: "90" },
	{ label: "Permanent", value: "permanent" },
];

function formatDate(date: Date | string): string {
	return new Date(date).toLocaleString();
}

function parseUserAgent(userAgent: string): string {
	if (!userAgent) return "Unknown Device";
	let browser = "Unknown Browser";
	let os = "Unknown OS";
	if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
		browser = "Chrome";
	else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
		browser = "Safari";
	else if (userAgent.includes("Firefox")) browser = "Firefox";
	else if (userAgent.includes("Edg")) browser = "Edge";
	if (userAgent.includes("Windows")) os = "Windows";
	else if (userAgent.includes("Mac OS X") || userAgent.includes("macOS"))
		os = "macOS";
	else if (userAgent.includes("Linux")) os = "Linux";
	else if (userAgent.includes("Android")) os = "Android";
	else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
		os = "iOS";
	const isMobile = /Mobile|Android|iPhone/.test(userAgent);
	return `${browser} on ${os} (${isMobile ? "Mobile" : "Desktop"})`;
}

export default function UserDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const id = params.id;

	const [status, setStatus] = useState<ApiStatus>("idle");
	const [user, setUser] = useState<AdminUser | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		role: "user",
	});
	const [saveStatus, setSaveStatus] = useState<ApiStatus>("idle");
	const [impersonateStatus, setImpersonateStatus] = useState<ApiStatus>("idle");

	const [sessions, setSessions] = useState<SessionRow[]>([]);
	const [sessionsStatus, setSessionsStatus] = useState<ApiStatus>("idle");
	const [revokeSessionStatus, setRevokeSessionStatus] =
		useState<ApiStatus>("idle");
	const [revokeAllSessionsStatus, setRevokeAllSessionsStatus] =
		useState<ApiStatus>("idle");

	const [banStatus, setBanStatus] = useState<ApiStatus>("idle");
	const [deleteStatus, setDeleteStatus] = useState<ApiStatus>("idle");
	const [banUserOpen, setBanUserOpen] = useState(false);
	const [deleteUserOpen, setDeleteUserOpen] = useState(false);
	const [banReason, setBanReason] = useState("");
	const [banDuration, setBanDuration] = useState("");

	const [resendVerificationStatus, setResendVerificationStatus] =
		useState<ApiStatus>("idle");
	const [resetPasswordStatus, setResetPasswordStatus] =
		useState<ApiStatus>("idle");

	const fetchUser = async () => {
		if (!id) return;
		setStatus("loading");
		try {
			const { data, error } = await authClient.admin.listUsers({
				query: {
					filterField: "id",
					filterValue: id,
					filterOperator: "eq",
					limit: 1,
				},
			});
			if (error) throw new Error(error.message);
			const u = data?.users?.[0] as AdminUser | undefined;
			if (!u) throw new Error("User not found");
			setUser(u);
			setFormData({
				name: u.name ?? "",
				email: u.email,
				role: u.role ?? "user",
			});
			setStatus("success");
		} catch (err) {
			setStatus("error");
			toast.error(getErrorMessage(err, "Failed to fetch user"));
		}
	};

	const fetchSessions = async () => {
		if (!id) return;
		setSessionsStatus("loading");
		try {
			const { data, error } = await authClient.admin.listUserSessions({
				userId: id,
			});
			if (error) throw new Error(error.message);
			const now = new Date();
			const raw = (data?.sessions ?? []) as unknown as Array<
				Record<string, unknown>
			>;
			// Determine the most recently active, non-expired session as "current".
			let currentId: string | null = null;
			let bestTime = 0;
			for (const s of raw) {
				const expiresAt = s.expiresAt ? new Date(s.expiresAt as string) : null;
				const expired = expiresAt ? now > expiresAt : false;
				if (!expired && s.updatedAt) {
					const t = new Date(s.updatedAt as string).getTime();
					if (t > bestTime) {
						bestTime = t;
						currentId = (s.id as string) ?? null;
					}
				}
			}
			const rows: SessionRow[] = raw.map((s) => {
				const expiresAt = s.expiresAt ? new Date(s.expiresAt as string) : null;
				return {
					id: (s.id as string) ?? "",
					token: (s.token as string) ?? "",
					device: parseUserAgent((s.userAgent as string) ?? ""),
					location: (s.ipAddress as string) ?? "Unknown Location",
					lastActive: s.updatedAt
						? new Date(s.updatedAt as string).toLocaleString()
						: "Unknown",
					current: currentId === (s.id as string),
					expired: expiresAt ? now > expiresAt : false,
				};
			});
			setSessions(rows);
			setSessionsStatus("success");
		} catch (err) {
			setSessionsStatus("error");
			toast.error(getErrorMessage(err, "Failed to load sessions"));
		}
	};

	useEffect(() => {
		fetchUser();
		fetchSessions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const handleSaveChanges = async () => {
		if (!user) return;
		const hasNameChange = formData.name.trim() !== (user.name ?? "");
		const hasEmailChange = formData.email.trim() !== user.email;
		const hasRoleChange = formData.role !== (user.role ?? "user");
		if (!hasNameChange && !hasEmailChange && !hasRoleChange) {
			toast.info("No changes to save");
			return;
		}
		setSaveStatus("loading");
		try {
			if (hasNameChange || hasEmailChange) {
				const updates: Record<string, unknown> = {};
				if (hasNameChange) updates.name = formData.name.trim();
				if (hasEmailChange) {
					updates.email = formData.email.trim();
					updates.emailVerified = false;
				}
				const { error } = await authClient.admin.updateUser({
					userId: user.id,
					data: updates,
				});
				if (error) throw new Error(error.message);
				toast.success("User updated successfully");
			}
			if (hasRoleChange) {
				const { error } = await authClient.admin.setRole({
					userId: user.id,
					role: formData.role as "user" | "admin",
				});
				if (error) throw new Error(error.message);
				toast.success("User role updated successfully");
			}
			setSaveStatus("success");
			await fetchUser();
		} catch (err) {
			setSaveStatus("error");
			toast.error(getErrorMessage(err, "Failed to save changes"));
		}
	};

	const handleBanUser = async () => {
		if (!user) return;
		if (!banReason.trim()) {
			toast.error("Ban reason is required");
			return;
		}
		setBanStatus("loading");
		try {
			let banExpiresIn: number | undefined;
			if (banDuration && banDuration !== "permanent") {
				banExpiresIn = 60 * 60 * 24 * Number.parseInt(banDuration);
			}
			const { error } = await authClient.admin.banUser({
				userId: user.id,
				banReason: banReason.trim(),
				...(banExpiresIn ? { banExpiresIn } : {}),
			});
			if (error) throw new Error(error.message);
			setBanStatus("success");
			setBanUserOpen(false);
			setBanReason("");
			setBanDuration("");
			toast.success("User banned successfully");
			await fetchUser();
		} catch (err) {
			setBanStatus("error");
			toast.error(getErrorMessage(err, "Failed to ban user"));
		}
	};

	const handleUnbanUser = async () => {
		if (!user) return;
		setBanStatus("loading");
		try {
			const { error } = await authClient.admin.unbanUser({ userId: user.id });
			if (error) throw new Error(error.message);
			setBanStatus("success");
			toast.success("User unbanned successfully");
			await fetchUser();
		} catch (err) {
			setBanStatus("error");
			toast.error(getErrorMessage(err, "Failed to unban user"));
		}
	};

	const handleDeleteUser = async () => {
		if (!user) return;
		setDeleteStatus("loading");
		try {
			const { error } = await authClient.admin.removeUser({ userId: user.id });
			if (error) throw new Error(error.message);
			setDeleteStatus("success");
			setDeleteUserOpen(false);
			toast.success("User deleted successfully");
			router.push("/admin/manage-users");
		} catch (err) {
			setDeleteStatus("error");
			toast.error(getErrorMessage(err, "Failed to delete user"));
		}
	};

	const handleImpersonateUser = async () => {
		if (!user) return;
		setImpersonateStatus("loading");
		try {
			const { error } = await authClient.admin.impersonateUser({
				userId: user.id,
			});
			if (error) throw new Error(error.message);
			setImpersonateStatus("success");
			toast.success(`Successfully impersonating ${user.name ?? user.email}`);
			window.location.reload();
		} catch (err) {
			setImpersonateStatus("error");
			toast.error(getErrorMessage(err, "Failed to impersonate user"));
		}
	};

	const handleResendVerification = async () => {
		if (!user?.email) return;
		setResendVerificationStatus("loading");
		try {
			const { error } = await authClient.sendVerificationEmail({
				email: user.email,
			});
			if (error) throw new Error(error.message);
			setResendVerificationStatus("success");
			toast.success("Verification email sent successfully");
		} catch (err) {
			setResendVerificationStatus("error");
			toast.error(getErrorMessage(err, "Failed to send verification email"));
		}
	};

	const handleResetPassword = async () => {
		if (!user?.email) return;
		setResetPasswordStatus("loading");
		try {
			const { error } = await authClient.requestPasswordReset({
				email: user.email,
			});
			if (error) throw new Error(error.message);
			setResetPasswordStatus("success");
			toast.success("Password reset email sent successfully");
		} catch (err) {
			setResetPasswordStatus("error");
			toast.error(getErrorMessage(err, "Failed to send password reset email"));
		}
	};

	const handleSessionRevoke = async (sessionToken: string) => {
		setRevokeSessionStatus("loading");
		try {
			const { error } = await authClient.admin.revokeUserSession({
				sessionToken,
			});
			if (error) throw new Error(error.message);
			setRevokeSessionStatus("success");
			toast.success("Session revoked successfully");
			await fetchSessions();
		} catch (err) {
			setRevokeSessionStatus("error");
			toast.error(getErrorMessage(err, "Failed to revoke session"));
		}
	};

	const handleAllSessionsRevoke = async () => {
		if (!user) return;
		setRevokeAllSessionsStatus("loading");
		try {
			const { error } = await authClient.admin.revokeUserSessions({
				userId: user.id,
			});
			if (error) throw new Error(error.message);
			setRevokeAllSessionsStatus("success");
			toast.success("All sessions revoked successfully");
			await fetchSessions();
		} catch (err) {
			setRevokeAllSessionsStatus("error");
			toast.error(getErrorMessage(err, "Failed to revoke all sessions"));
		}
	};

	if (status === "loading") {
		return (
			<div className="flex flex-1 items-center justify-center gap-2 p-8 text-muted-foreground">
				<ActivityIndicator size={20} />
				Loading user details...
			</div>
		);
	}

	if (status === "error" || !user) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
				<p className="text-destructive">Failed to load user details</p>
				<Button onClick={() => router.back()}>Go Back</Button>
			</div>
		);
	}

	return (
		<div className="flex-1 bg-background">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-border p-4">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="sm" onClick={() => router.back()}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<p className="text-xl font-semibold">
							{user.name || "Unnamed User"}
						</p>
						<p className="text-sm text-muted-foreground">{user.email}</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-4 p-4">
				{/* User Info Card */}
				<Card>
					<CardHeader className="flex-row items-center justify-between">
						<CardTitle>User Information</CardTitle>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={saveStatus === "loading"}
								onClick={() =>
									setFormData({
										name: user.name ?? "",
										email: user.email,
										role: user.role ?? "user",
									})
								}
							>
								Reset
							</Button>
							<Button
								size="sm"
								disabled={saveStatus === "loading"}
								onClick={handleSaveChanges}
							>
								{saveStatus === "loading" ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label>Name</Label>
							<Input
								value={formData.name}
								onChange={(e) =>
									setFormData((f) => ({ ...f, name: e.target.value }))
								}
								placeholder="Enter user name"
								disabled={saveStatus === "loading"}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Email</Label>
							<Input
								value={formData.email}
								onChange={(e) =>
									setFormData((f) => ({ ...f, email: e.target.value }))
								}
								placeholder="Enter email address"
								disabled={saveStatus === "loading"}
							/>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">
								Email Verification Status
							</span>
							<Badge variant={user.emailVerified ? "default" : "destructive"}>
								{user.emailVerified ? "Verified" : "Unverified"}
							</Badge>
						</div>

						<Separator />

						<div className="flex flex-col gap-2">
							<Label>Role</Label>
							<Select
								value={formData.role}
								onValueChange={(value) =>
									setFormData((f) => ({ ...f, role: value }))
								}
								disabled={saveStatus === "loading"}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									{ROLE_OPTIONS.map((r) => (
										<SelectItem key={r.value} value={r.value}>
											{r.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<Separator />

						<div className="flex flex-col gap-2">
							<Label>Status</Label>
							{user.banned ? (
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2">
										<Badge variant="destructive">Banned</Badge>
										<Button
											variant="outline"
											size="sm"
											onClick={handleUnbanUser}
											disabled={banStatus === "loading"}
										>
											{banStatus === "loading" ? "Unbanning..." : "Unban User"}
										</Button>
									</div>
									{user.banReason && (
										<span className="text-xs text-muted-foreground">
											Reason: {user.banReason}
										</span>
									)}
									{user.banExpires && (
										<span className="text-xs text-muted-foreground">
											Expires: {formatDate(user.banExpires)}
										</span>
									)}
								</div>
							) : (
								<div className="flex items-center gap-2">
									<Badge className="bg-green-600">Active</Badge>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setBanUserOpen(true)}
										disabled={banStatus === "loading"}
									>
										Ban User
									</Button>
								</div>
							)}
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Created</span>
							<span className="text-sm font-medium">
								{formatDate(user.createdAt)}
							</span>
						</div>
						{user.updatedAt && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Last Updated</span>
									<span className="text-sm font-medium">
										{formatDate(user.updatedAt)}
									</span>
								</div>
							</>
						)}
						{user.lastLogin && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Last Login</span>
									<span className="text-sm font-medium">
										{formatDate(user.lastLogin)}
									</span>
								</div>
							</>
						)}

						<Separator />

						<div className="flex flex-col gap-2">
							<Label>Actions</Label>
							<div className="flex flex-wrap gap-2">
								{!user.emailVerified && (
									<Button
										variant="outline"
										size="sm"
										onClick={handleResendVerification}
										disabled={resendVerificationStatus === "loading"}
									>
										<Mail className="h-4 w-4" />
										{resendVerificationStatus === "loading"
											? "Sending..."
											: "Resend Verification"}
									</Button>
								)}
								<Button
									variant="outline"
									size="sm"
									onClick={handleImpersonateUser}
									disabled={impersonateStatus === "loading"}
								>
									<UserCheck className="h-4 w-4" />
									{impersonateStatus === "loading"
										? "Impersonating..."
										: "Impersonate User"}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={handleResetPassword}
									disabled={resetPasswordStatus === "loading"}
								>
									<Key className="h-4 w-4" />
									{resetPasswordStatus === "loading"
										? "Sending..."
										: "Reset Password"}
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onClick={() => setDeleteUserOpen(true)}
									disabled={deleteStatus === "loading"}
								>
									<Trash2 className="h-4 w-4" />
									Delete User
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Active Sessions Card */}
				<Card>
					<CardHeader className="flex-row items-center justify-between">
						<CardTitle>Active Sessions</CardTitle>
						<Button
							variant="destructive"
							size="sm"
							onClick={handleAllSessionsRevoke}
							disabled={
								sessionsStatus === "loading" ||
								revokeAllSessionsStatus === "loading" ||
								sessions.length === 0
							}
						>
							{revokeAllSessionsStatus === "loading"
								? "Revoking..."
								: "Revoke All"}
						</Button>
					</CardHeader>
					<CardContent>
						{sessionsStatus === "loading" ? (
							<p className="text-muted-foreground">Loading sessions...</p>
						) : sessions.length === 0 ? (
							<p className="text-muted-foreground">No active sessions</p>
						) : (
							<div className="flex flex-col gap-3">
								{sessions.map((session, index) => (
									<div key={session.id}>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<span className="font-medium">{session.device}</span>
													{session.current && (
														<Badge variant="outline" className="text-xs">
															Current
														</Badge>
													)}
													{session.expired && (
														<Badge variant="destructive" className="text-xs">
															Expired
														</Badge>
													)}
												</div>
												<p className="text-sm text-muted-foreground">
													{session.location}
												</p>
												<p className="text-xs text-muted-foreground">
													Last active: {session.lastActive}
												</p>
											</div>
											{!session.expired && !session.current && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleSessionRevoke(session.token)}
													disabled={revokeSessionStatus === "loading"}
													className="text-destructive"
												>
													{revokeSessionStatus === "loading"
														? "Revoking..."
														: "Revoke"}
												</Button>
											)}
										</div>
										{index < sessions.length - 1 && (
											<Separator className="mt-3" />
										)}
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Ban User Dialog */}
			<Dialog open={banUserOpen} onOpenChange={setBanUserOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Ban User</DialogTitle>
						<DialogDescription>
							Ban {user.name || user.email} from the platform
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4 py-4">
						<div className="flex flex-col gap-2">
							<Label>Ban Reason *</Label>
							<Input
								value={banReason}
								onChange={(e) => setBanReason(e.target.value)}
								placeholder="Enter reason for ban"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Ban Duration</Label>
							<Select value={banDuration} onValueChange={setBanDuration}>
								<SelectTrigger>
									<SelectValue placeholder="Select ban duration" />
								</SelectTrigger>
								<SelectContent>
									{BAN_DURATIONS.map((d) => (
										<SelectItem key={d.value} value={d.value}>
											{d.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setBanUserOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleBanUser}
							disabled={banStatus === "loading"}
						>
							{banStatus === "loading" ? "Banning..." : "Ban User"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete User Dialog */}
			<Dialog open={deleteUserOpen} onOpenChange={setDeleteUserOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete User</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete {user.name || user.email}? This
							action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteUserOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteUser}
							disabled={deleteStatus === "loading"}
						>
							{deleteStatus === "loading" ? "Deleting..." : "Delete User"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
