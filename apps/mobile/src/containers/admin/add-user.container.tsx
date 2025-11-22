import { observer } from "@legendapp/state/react";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import { addUserModel, type UserRole } from "~/models/admin/add-user.model";

export const AddUser = observer(() => {
	const { form, status, error } = addUserModel.obs.get();

	const handleSubmit = async () => {
		await addUserModel.createUser();
	};

	const updateForm = (updates: Partial<typeof form>) => {
		addUserModel.updateForm(updates);
		// Clear error when user starts typing
		if (error) {
			addUserModel.clearError();
		}
	};

	const isLoading = status === "loading";

	return (
		<ScrollView className="flex-1 bg-background p-4">
			<Card>
				<CardHeader>
					<CardTitle>Add New User</CardTitle>
					<CardDescription>
						Create a new user account with the specified details
					</CardDescription>
				</CardHeader>
				<CardContent className="gap-4">
					<View className="gap-2">
						<Label htmlFor="name">Name *</Label>
						<Input
							id="name"
							placeholder="Enter user's full name"
							value={form.name}
							onChangeText={(text) => updateForm({ name: text })}
						/>
					</View>

					<View className="gap-2">
						<Label htmlFor="email">Email *</Label>
						<Input
							id="email"
							placeholder="Enter email address"
							value={form.email}
							onChangeText={(text) => updateForm({ email: text })}
							keyboardType="email-address"
							autoCapitalize="none"
						/>
					</View>

					<View className="gap-2">
						<Label htmlFor="password">Password *</Label>
						<Input
							id="password"
							placeholder="Enter password"
							value={form.password}
							onChangeText={(text) => updateForm({ password: text })}
							secureTextEntry
						/>
					</View>

					<View className="gap-2">
						<Label htmlFor="role">Role</Label>
						<Select
							value={{
								value: form.role,
								label: form.role === "admin" ? "Admin" : "User",
							}}
							onValueChange={(option) => {
								if (option) {
									updateForm({ role: option.value as UserRole });
								}
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select user role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="user" label="User">
									User
								</SelectItem>
								<SelectItem value="admin" label="Admin">
									Admin
								</SelectItem>
							</SelectContent>
						</Select>
					</View>

					<View className="flex-row items-center justify-between">
						<View className="flex-1">
							<Label htmlFor="autoVerify">Auto-verify email</Label>
							<Text className="text-sm text-muted-foreground">
								Skip email verification for this user
							</Text>
						</View>
						<Switch
							id="autoVerify"
							checked={form.autoVerify}
							onCheckedChange={(checked: boolean) =>
								updateForm({ autoVerify: checked })
							}
						/>
					</View>

					<View className="flex-col gap-3 pt-6 md:flex-row md:gap-4 lg:gap-6">
						<Button
							variant="outline"
							className="flex-1"
							onPress={() => router.back()}
							disabled={isLoading}
						>
							<Text>Cancel</Text>
						</Button>
						<Button
							className="flex-1"
							onPress={handleSubmit}
							disabled={isLoading}
						>
							<Text>{isLoading ? "Creating..." : "Create User"}</Text>
						</Button>
					</View>
				</CardContent>
			</Card>
		</ScrollView>
	);
});
