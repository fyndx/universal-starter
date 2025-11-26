import { observer } from "@legendapp/state/react";
import { type Href, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { View } from "react-native";
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
                className="mt-1 native:w-72 w-64 gap-2"
                insets={{ right: 16, top: 8, bottom: 8, left: 16 }}
              >
                <DropdownMenuLabel className="flex flex-col items-start">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-semibold text-lg">
                      {data?.user.name}
                    </Text>
                    {isImpersonating && (
                      <View className="h-2 w-2 rounded-full bg-yellow-500" />
                    )}
                  </View>
                  <Text className="text-muted-foreground text-sm">
                    {data?.user.email}
                  </Text>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isImpersonating && (
                  <>
                    <Button
                      className="flex-row items-center gap-2"
                      disabled={stopImpersonationStatus === "loading"}
                      onPress={handleStopImpersonating}
                      size="sm"
                      variant="outline"
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
                    className="text-muted-foreground hover:text-primary focus:text-primary"
                    key={option.label}
                    onPress={() => {
                      push(option.path as Href);
                    }}
                  >
                    {option.icon}
                    <Text>{option.label}</Text>
                  </DropdownMenuItem>
                ))}
                <Button
                  onPress={() => {
                    authClient.signOut();
                  }}
                  size="sm"
                  variant="destructive"
                >
                  <Text>Logout</Text>
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!(data || isPending) && (
            <Button
              onPress={() => {
                push("/auth", { withAnchor: true });
              }}
              size="sm"
              variant="outline"
            >
              <Text>Login</Text>
            </Button>
          )}
        </View>
        {/* Mobile */}
        {/* <div className="flex md:hidden">
          {!(isPending || data) && (
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
        </div> */}
      </View>
      <BottomSheetModal ref={bottomSheetModalRef}>
        <BottomSheetView className="bg-background p-4">
          {data ? (
            <View className="gap-2 bg-background p-4">
              <View className="flex-row items-center gap-2">
                <Text className="font-semibold text-lg">{data?.user.name}</Text>
                {isImpersonating && (
                  <View className="h-2 w-2 rounded-full bg-yellow-500" />
                )}
              </View>
              <Text className="text-muted-foreground text-sm">
                {data?.user.email}
              </Text>
              {isImpersonating && (
                <Button
                  className="flex-row items-center gap-2"
                  disabled={stopImpersonationStatus === "loading"}
                  onPress={handleStopImpersonating}
                  size="sm"
                  variant="outline"
                >
                  {stopImpersonationStatus === "loading" && (
                    <ActivityIndicator size="small" />
                  )}
                  <Text>Stop Impersonating</Text>
                </Button>
              )}
              {Options.map((option) => (
                <Button
                  className="flex-row gap-2 text-muted-foreground hover:text-primary focus:text-primary"
                  key={option.label}
                  onPress={() => {
                    bottomSheetModalRef.current?.dismiss();
                    push(option.path as Href);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  {option.icon}
                  <Text>{option.label}</Text>
                </Button>
              ))}
              <Button
                onPress={() => {
                  authClient.signOut();
                }}
                size="sm"
                variant="destructive"
              >
                <Text>Logout</Text>
              </Button>
            </View>
          ) : (
            <View className="p-4">
              <Button onPress={() => push("/auth", { withAnchor: true })}>
                <Text>Login</Text>
              </Button>
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
});
