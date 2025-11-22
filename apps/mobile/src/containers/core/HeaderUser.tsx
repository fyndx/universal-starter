import { observer } from "@legendapp/state/react";
import { type Href, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Pressable, View } from "react-native";
import { ActivityIndicator } from "~/components/ui/activity-indicator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	BottomSheetModal,
	BottomSheetView,
} from "~/components/ui/bottom-sheet/index";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { authClient } from "~/lib/auth-client";
import { Menu } from "~/lib/icons/Menu";
import { Shield } from "~/lib/icons/Shield";
import { impersonationModel$ } from "~/models/core/impersonation.model";

const Options = [
	{
		label: "Admin",
		icon: <Shield size={16} />,
		path: "/admin/manage-users",
	},
];

export const HeaderUser = observer(() => {
	const { isPending, data } = authClient.useSession();
	const { push } = useRouter();
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	// Sync impersonation state with session data when it changes
	useEffect(() => {
		if (data) {
			impersonationModel$.syncWithSession({ sessionData: data });
		}
	}, [data]);

	const { isImpersonating, stopImpersonationStatus } =
		impersonationModel$.obs.get();

	const handleStopImpersonating = async () => {
		await impersonationModel$.stopImpersonating();
	};

	return (
		<>
			<View className="flex flex-row items-center justify-between gap-2">
				{/* Tablet and Desktop */}
				<View className="hidden md:flex">
					{isPending && <ActivityIndicator />}
					{data && !isPending && (
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Avatar alt={data?.user.name ?? "User"}>
									<AvatarImage
										source={{ uri: data?.user?.image ?? undefined }}
									/>
									<AvatarFallback>
										<Text>{data?.user?.name.charAt(0) ?? "U"}</Text>
									</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								insets={{ right: 16, top: 8, bottom: 8, left: 16 }}
								className="w-64 native:w-72 mt-1 gap-2"
							>
								<DropdownMenuLabel className="flex flex-col items-start">
									<View className="flex-row items-center gap-2">
										<Text className="text-lg font-semibold">
											{data?.user.name}
										</Text>
										{isImpersonating && (
											<View className="w-2 h-2 rounded-full bg-yellow-500" />
										)}
									</View>
									<Text className="text-sm text-muted-foreground">
										{data?.user.email}
									</Text>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{isImpersonating && (
									<>
										<Button
											variant="outline"
											size="sm"
											onPress={handleStopImpersonating}
											disabled={stopImpersonationStatus === "loading"}
											className="flex-row items-center gap-2"
										>
											{stopImpersonationStatus === "loading" && (
												<ActivityIndicator size="small" />
											)}
											<Text>Stop Impersonating</Text>
										</Button>
										<DropdownMenuSeparator />
									</>
								)}
								{Options.map((option) => (
									<DropdownMenuItem
										key={option.label}
										className="text-muted-foreground hover:text-primary focus:text-primary"
										onPress={() => {
											push(option.path as Href);
										}}
									>
										{option.icon}
										<Text>{option.label}</Text>
									</DropdownMenuItem>
								))}
								<Button
									variant="destructive"
									size="sm"
									onPress={() => {
										authClient.signOut();
									}}
								>
									<Text>Logout</Text>
								</Button>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
					{!data && !isPending && (
						<Button
							variant="outline"
							size="sm"
							onPress={() => {
								push("/auth/sign-in", { withAnchor: true });
							}}
						>
							<Text>Login</Text>
						</Button>
					)}
				</View>
				{/* Mobile */}
				<div className="flex md:hidden">
					{!isPending && !data && (
						<Button
							onPress={() => bottomSheetModalRef.current?.present()}
							variant={"ghost"}
						>
							<Menu className="text-base text-foreground" />
						</Button>
					)}
					{data && !isPending && (
						<Pressable onPress={() => bottomSheetModalRef.current?.present()}>
							<Avatar alt={data?.user.name ?? "User"}>
								<AvatarImage source={{ uri: data?.user?.image ?? undefined }} />
								<AvatarFallback>
									<Text>{data?.user?.name.charAt(0) ?? "U"}</Text>
								</AvatarFallback>
							</Avatar>
						</Pressable>
					)}
				</div>
			</View>
			<BottomSheetModal ref={bottomSheetModalRef}>
				<BottomSheetView className="bg-background p-4">
					{data ? (
						<View className="bg-background p-4 gap-2">
							<View className="flex-row items-center gap-2">
								<Text className="text-lg font-semibold">{data?.user.name}</Text>
								{isImpersonating && (
									<View className="w-2 h-2 rounded-full bg-yellow-500" />
								)}
							</View>
							<Text className="text-sm text-muted-foreground">
								{data?.user.email}
							</Text>
							{isImpersonating && (
								<Button
									variant="outline"
									size="sm"
									onPress={handleStopImpersonating}
									disabled={stopImpersonationStatus === "loading"}
									className="flex-row items-center gap-2"
								>
									{stopImpersonationStatus === "loading" && (
										<ActivityIndicator size="small" />
									)}
									<Text>Stop Impersonating</Text>
								</Button>
							)}
							{Options.map((option) => (
								<Button
									key={option.label}
									variant="ghost"
									size="sm"
									onPress={() => {
										bottomSheetModalRef.current?.dismiss();
										push(option.path as Href);
									}}
									className="flex-row gap-2 text-muted-foreground hover:text-primary focus:text-primary"
								>
									{option.icon}
									<Text>{option.label}</Text>
								</Button>
							))}
							<Button
								variant="destructive"
								size="sm"
								onPress={() => {
									authClient.signOut();
								}}
							>
								<Text>Logout</Text>
							</Button>
						</View>
					) : (
						<View className="p-4">
							<Button
								onPress={() => push("/auth/sign-in", { withAnchor: true })}
							>
								<Text>Login</Text>
							</Button>
						</View>
					)}
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
});
