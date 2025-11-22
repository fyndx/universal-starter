import { router } from "expo-router";
import { Eye } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { TableCell, TableRow } from "~/components/ui/table";
import { Text } from "~/components/ui/text";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface User {
	id: string;
	name?: string;
	email: string;
	emailVerified: boolean;
	role?: string;
	banned: boolean;
	banReason?: string;
	banExpires?: string;
	createdAt: string;
}

interface UserTableRowProps {
	user: User;
	index: number;
	columnWidths: number[];
}

export const UserTableRow = React.memo(
	({ user, index, columnWidths }: UserTableRowProps) => {
		const handleViewDetails = () => {
			// Navigate to user detail screen
			router.push(`/admin/user-detail/${user.id}`);
		};

		return (
			<TableRow
				key={user.id}
				className={cn("active:bg-secondary", index % 2 && "bg-muted/40")}
			>
				<TableCell style={{ width: columnWidths[0] }}>
					<Text className="font-medium">{user.name || "—"}</Text>
				</TableCell>
				<TableCell style={{ width: columnWidths[1] }}>
					<Text className="text-sm text-muted-foreground">{user.email}</Text>
				</TableCell>
				<TableCell style={{ width: columnWidths[2] }}>
					<Text
						className={`text-sm ${user.emailVerified ? "text-green-600" : "text-orange-600"}`}
					>
						{user.emailVerified ? "Verified" : "Unverified"}
					</Text>
				</TableCell>
				<TableCell style={{ width: columnWidths[3] }}>
					<Text className="text-sm text-muted-foreground">—</Text>
				</TableCell>
				<TableCell style={{ width: columnWidths[4] }}>
					<Text className="text-sm capitalize">{user.role || "user"}</Text>
				</TableCell>
				<TableCell style={{ width: columnWidths[5] }}>
					{user.banned ? (
						<View className="gap-1">
							<Text className="text-sm text-red-600">Banned</Text>
							{user.banReason && (
								<Tooltip>
									<TooltipTrigger>
										<Text className="text-xs text-red-500">
											{user.banReason}
										</Text>
									</TooltipTrigger>
									<TooltipContent>
										<Text>
											{user.banExpires
												? `Ban expires: ${new Date(user.banExpires).toLocaleString()}`
												: "Permanent ban"}
										</Text>
									</TooltipContent>
								</Tooltip>
							)}
						</View>
					) : (
						<Text className="text-sm text-green-600">Active</Text>
					)}
				</TableCell>
				<TableCell style={{ width: columnWidths[6] }}>
					<Text className="text-sm text-muted-foreground">—</Text>
				</TableCell>
				<TableCell style={{ width: columnWidths[7] }}>
					<Text className="text-sm text-muted-foreground">
						{new Date(user.createdAt).toLocaleDateString()}
					</Text>
				</TableCell>
				<TableCell style={{ width: columnWidths[8] }}>
					<Button
						variant="ghost"
						size="sm"
						className="flex-row items-center"
						onPress={handleViewDetails}
					>
						<Text>
							<Eye className="h-4 w-4 mr-2" />
						</Text>
						<Text>View User</Text>
					</Button>
				</TableCell>
			</TableRow>
		);
	},
);

UserTableRow.displayName = "UserTableRow";
