import { observer } from "@legendapp/state/react";
import { FlashList } from "@shopify/flash-list";
import type { UserWithRole } from "better-auth/plugins/admin";
import { useFocusEffect } from "expo-router";
import * as React from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pagination } from "~/components/ui/pagination";
import { Table, TableBody, TableHeader } from "~/components/ui/table";
import { Text } from "~/components/ui/text";
import { UserTableHeader } from "~/containers/admin/components/user-table-header";
import { UserTableRow } from "~/containers/admin/components/user-table-row";
import { UsersListFilters } from "~/containers/admin/components/users-list-filters";
import type { ManageUsersListModel } from "~/models/admin/manage-users-list.model";

interface UsersListProps {
	userListModel$: ManageUsersListModel;
}

// Separate component for the table to optimize re-renders
const UsersTable = observer(
	({
		model,
		columnWidths,
	}: {
		model: ManageUsersListModel;
		columnWidths: number[];
	}) => {
		const data = model.obs.data.get();
		const users = data?.users;
		const insets = useSafeAreaInsets();

		return (
			<Table aria-labelledby="users-table">
				<TableHeader>
					<UserTableHeader columnWidths={columnWidths} />
				</TableHeader>
				<TableBody>
					<FlashList
						data={users || []}
						estimatedItemSize={60}
						contentContainerStyle={{
							paddingBottom: insets.bottom,
						}}
						showsVerticalScrollIndicator={false}
						keyExtractor={(item: UserWithRole) => item.id}
						renderItem={({
							item: user,
							index,
						}: {
							item: UserWithRole;
							index: number;
						}) => (
							<UserTableRow
								user={user as any}
								index={index}
								columnWidths={columnWidths}
							/>
						)}
						ListEmptyComponent={() => (
							<View className="flex-1 justify-center items-center p-8">
								<Text className="text-muted-foreground text-center">
									No users found
								</Text>
							</View>
						)}
						ListFooterComponent={() => {
							const totalUsers = data?.total || 0;
							const pageSize = model.obs.metadata.pageSize.get();
							const currentPage = model.obs.metadata.currentPage.get();
							const totalPages = Math.ceil(totalUsers / pageSize);

							return (
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									totalItems={totalUsers}
									currentItemsCount={users?.length || 0}
									itemName="user"
									onPreviousPage={model.goToPreviousPage}
									onNextPage={model.goToNextPage}
								/>
							);
						}}
					/>
				</TableBody>
			</Table>
		);
	},
);

export const UsersList = observer(
	({ userListModel$: model }: UsersListProps) => {
		// Use granular observables to prevent unnecessary re-renders
		const status = model.obs.status.get();
		const error = model.obs.error.get();
		const { width } = useWindowDimensions();

		// Refresh data when screen comes into focus (e.g., after adding a user)
		useFocusEffect(
			React.useCallback(() => {
				// Only refresh if we have previously loaded data
				const hasData = model.obs.data.get();
				if (hasData) {
					model.fetchUsers();
				}
			}, [model]),
		);

		// Define minimum column widths
		const MIN_COLUMN_WIDTHS = [120, 180, 120, 120, 100, 100, 120, 120, 80];

		const columnWidths = React.useMemo(() => {
			return MIN_COLUMN_WIDTHS.map((minWidth) => {
				const evenWidth = width / MIN_COLUMN_WIDTHS.length;
				return evenWidth > minWidth ? evenWidth : minWidth;
			});
		}, [width]);

		return (
			<View className="flex-1 p-4">
				<Text className="text-2xl font-bold mb-4">Manage Users</Text>

				{/* Search and Filters - separate component, won't re-render table */}
				<UsersListFilters userListModel$={model} />

				{status === "loading" && (
					<View className="flex-1 justify-center items-center p-8">
						<Text className="text-muted-foreground">Loading users...</Text>
					</View>
				)}

				{status === "error" && (
					<View className="flex-1 justify-center items-center p-8">
						<Text className="text-destructive text-center">
							Failed to load users: {error?.message || "Unknown error"}
						</Text>
					</View>
				)}

				{status === "success" && (
					<ScrollView
						horizontal
						bounces={false}
						showsHorizontalScrollIndicator={false}
					>
						<UsersTable model={model} columnWidths={columnWidths} />
					</ScrollView>
				)}
			</View>
		);
	},
);
