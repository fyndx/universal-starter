import {
  KeyboardAvoidingView,
  type KeyboardAvoidingViewProps,
  Platform,
} from "react-native";
import { SystemBars, type SystemBarsProps } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "~/hooks/useColorScheme";
import { cn } from "~/lib/utils";

const isIos = Platform.OS === "ios";
const keyboardOffset = isIos ? 20 : 0;

export const Screen = ({
  children,
  className,
  SystemBarsProps,
  KeyboardAvoidingViewProps,
}: {
  children: React.ReactNode;
  className?: string;
  SystemBarsProps?: SystemBarsProps;
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
}) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <SafeAreaView className={cn("flex-1", className)}>
      <SystemBars
        style={isDarkColorScheme ? "dark" : "light"}
        {...SystemBarsProps}
      />
      <KeyboardAvoidingView
        behavior={isIos ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
        {...KeyboardAvoidingViewProps}
        style={[{ flex: 1 }, KeyboardAvoidingViewProps?.style]}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
