"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";
import type { ApiStatus } from "@/lib/api-status";

interface AdminUser {
	id: string;
	email: string;
	name?: string;
	role?: string;
	emailVerified?: boolean;
	banned?: boolean;
	createdAt: Date | string;
}

const PAGE_SIZE = 10;

function formatDate(date: Date | string): string {
	return new Date(date).toLocaleDateString();
}

export default function ManageUsersPage() {
	const [status, setStatus] = useState<ApiStatus>("idle");
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [error, setError] = useState<string | null>(null);

	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [role, setRole] = useState("all");

	const fetchUsers = useCallback(async () => {
		setStatus("loading");
		setError(null);
		try {
			const offset = (currentPage - 1) * PAGE_SIZE;
			const query: Record<string, string | number> = {
				limit: PAGE_SIZE,
				offset,
				sortBy: "createdAt",
				sortDirection: "desc",
			};
			if (search) {
				query.searchValue = search;
				query.searchField = "email";
				query.searchOperator = "contains";
			}
			if (role !== "all") {
				query.filterField = "role";
				query.filterValue = role;
				query.filterOperator = "eq";
			}

			const { data, error: apiError } = await authClient.admin.listUsers({
				query,
			});
			if (apiError) {
				throw new Error(apiError.message || "Failed to fetch users");
			}
			setUsers((data?.users ?? []) as AdminUser[]);
			setTotal(data?.total ?? 0);
			setStatus("success");
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An unexpected error occurred while fetching users",
			);
			setStatus("error");
		}
	}, [currentPage, search, role]);

	// Initial + param-driven fetch
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	// Debounced search input
	useEffect(() => {
		const handle = setTimeout(() => {
			if (searchInput !== search) {
				setSearch(searchInput);
				setCurrentPage(1);
			}
		}, 400);
		return () => clearTimeout(handle);
	}, [searchInput, search]);

	const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

	const handleRoleChange = (value: string) => {
		setRole(value);
		setCurrentPage(1);
	};

	const goToNextPage = () => {
		setCurrentPage((p) => Math.min(p + 1, totalPages));
	};
	const goToPreviousPage = () => {
		setCurrentPage((p) => Math.max(p - 1, 1));
	};

	return (
		<div className="flex-1 bg-background p-4 sm:p-6">
			<div className="mx-auto max-w-6xl">
				<Button asChild variant="ghost" size="sm" className="mb-2">
					<Link href="/admin">
						<ArrowLeft className="h-4 w-4" />
						Back
					</Link>
				</Button>
				<h1 className="mb-4 text-2xl font-bold text-foreground">
					Manage Users
				</h1>

				{/* Filters */}
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search by email..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							className="pl-9"
						/>
					</div>
					<Select value={role} onValueChange={handleRoleChange}>
						<SelectTrigger className="w-full sm:w-40">
							<SelectValue placeholder="Filter by role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Roles</SelectItem>
							<SelectItem value="user">User</SelectItem>
							<SelectItem value="admin">Admin</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{status === "loading" && (
					<div className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
						<ActivityIndicator size={20} />
						Loading users...
					</div>
				)}

				{status === "error" && (
					<div className="p-8 text-center text-destructive">
						Failed to load users: {error ?? "Unknown error"}
					</div>
				)}

				{status === "success" && (
					<div className="rounded-xl border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Verified</TableHead>
									<TableHead>Created</TableHead>
									<TableHead className="w-[80px]" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="p-8 text-center text-muted-foreground"
										>
											No users found
										</TableCell>
									</TableRow>
								) : (
									users.map((user) => (
										<TableRow key={user.id}>
											<TableCell className="font-medium">
												{user.name || "—"}
											</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell>
												<Badge
													variant={
														user.role === "admin" ? "default" : "secondary"
													}
												>
													{user.role ?? "user"}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant={
														user.emailVerified ? "default" : "destructive"
													}
												>
													{user.emailVerified ? "Verified" : "Unverified"}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{formatDate(user.createdAt)}
											</TableCell>
											<TableCell>
												<Button asChild variant="ghost" size="sm">
													<Link href={`/admin/users/${user.id}`}>
														<ChevronRight className="h-4 w-4" />
													</Link>
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							totalItems={total}
							currentItemsCount={users.length}
							itemName="user"
							onPreviousPage={goToPreviousPage}
							onNextPage={goToNextPage}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
