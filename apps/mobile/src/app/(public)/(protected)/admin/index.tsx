import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";

export default function AdminDashboard() {
	return (
		<View className="flex-1 bg-background p-4">
			<Card>
				<CardHeader>
					<CardTitle>Admin Dashboard</CardTitle>
					<CardDescription>Manage users and system settings</CardDescription>
				</CardHeader>
				<CardContent className="gap-4">
					<Button
						onPress={() => router.push("/(public)/(protected)/admin/add-user")}
						className="w-full"
					>
						<Text>Add User</Text>
					</Button>

					{/* Placeholder for other admin functions */}
					<Button
						variant="outline"
						className="w-full"
						onPress={() =>
							router.push("/(public)/(protected)/admin/manage-users")
						}
					>
						<Text>Manage Users</Text>
					</Button>

					<Button variant="outline" disabled className="w-full">
						<Text>System Settings (Coming Soon)</Text>
					</Button>
				</CardContent>
			</Card>
		</View>
	);
}
