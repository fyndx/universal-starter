import { useMount } from "@legendapp/state/react";
import { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { UsersList } from "~/containers/admin/manage-users-list.container";
import { ManageUsersListModel } from "~/models/admin/manage-users-list.model";

export default function ManageUsersScreen() {
	const manageUsersListModel$ = useRef(new ManageUsersListModel()).current;

	useMount(() => {
		manageUsersListModel$.fetchUsers();
	});

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<UsersList userListModel$={manageUsersListModel$} />
		</SafeAreaView>
	);
}
