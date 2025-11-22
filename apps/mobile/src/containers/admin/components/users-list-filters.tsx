import { observer } from "@legendapp/state/react";
import { router } from "expo-router";
import * as React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import type { ManageUsersListModel } from "~/models/admin/manage-users-list.model";

interface UsersListFiltersProps {
	userListModel$: ManageUsersListModel;
}

export const UsersListFilters = observer(
	({ userListModel$: model }: UsersListFiltersProps) => {
		const { search, searchInput, role } = model.obs.filters.get();
		const insets = useSafeAreaInsets();

		const roleRef = React.useRef<React.ElementRef<typeof SelectTrigger> | null>(
			null,
		);

		const contentInsets = {
			top: insets.top,
			bottom: Platform.select({
				ios: insets.bottom,
				android: insets.bottom + 24,
			}),
			left: 12,
			right: 12,
		};

		// Debounce search input
		React.useEffect(() => {
			const timer = setTimeout(() => {
				if (searchInput !== search) {
					model.setSearchFilter(searchInput);
				}
			}, 300);

			return () => clearTimeout(timer);
		}, [searchInput, search, model]);

		const roleOptions = [
			{ value: "all", label: "All Roles" },
			{ value: "admin", label: "Admin" },
			{ value: "user", label: "User" },
			{ value: "moderator", label: "Moderator" },
		];

		const handleRoleChange = (
			option: { value: string; label: string } | undefined,
		) => {
			if (option) {
				model.setRoleFilter(option.value);
			}
		};

		return (
			<View className="mb-6 gap-4">
				{/* Main Filter Row */}
				<View className="flex-row gap-4 items-end justify-between">
					{/* Left side - Filters */}
					<View className="flex-row gap-4 flex-1 flex-wrap">
						{/* Search Input */}
						<View className="gap-2 flex-1 max-w-64">
							<Text className="text-sm font-medium">Search by email</Text>
							<Input
								placeholder="Search user by email"
								value={searchInput}
								onChangeText={model.setSearchInput}
								className="w-full"
							/>
						</View>

						{/* Role Filter */}
						<View className="gap-2 flex-1 max-w-48">
							<Text className="text-sm font-medium">Filter by role</Text>
							<Select
								value={roleOptions.find((option) => option.value === role)}
								onValueChange={handleRoleChange}
							>
								<SelectTrigger
									ref={roleRef}
									className={`w-full ${role !== "all" ? "border-primary" : ""}`}
									onTouchStart={() => {
										roleRef.current?.open();
									}}
								>
									<SelectValue
										className="text-foreground text-sm native:text-lg"
										placeholder="Select role"
									/>
								</SelectTrigger>
								<SelectContent insets={contentInsets} className="w-full">
									{roleOptions.map((option) => (
										<SelectItem
											key={option.value}
											label={option.label}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</View>
					</View>

					{/* Right side - Action Buttons */}
					<View className="flex-row gap-2">
						<Button variant="outline" onPress={model.clearFilters}>
							<Text>Clear Filters</Text>
						</Button>
						<Button
							variant="default"
							onPress={() =>
								router.push("/(public)/(protected)/admin/add-user")
							}
						>
							<Text>Add User</Text>
						</Button>
					</View>
				</View>
			</View>
		);
	},
);
