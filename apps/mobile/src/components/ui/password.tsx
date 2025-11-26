import { Eye, EyeOff } from "lucide-react-native";
import { type RefObject, useState } from "react";
import {
  Pressable,
  type TextInput,
  type TextInputProps,
  View,
} from "react-native";
import { Icon } from "./icon";
import { Input } from "./input";

interface PasswordInputProps extends Omit<TextInputProps, "secureTextEntry"> {
  ref?: RefObject<TextInput>;
}

function PasswordInput({
  className,
  placeholderClassName,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="relative">
      <Input
        className={`pr-10 ${className || ""}`}
        placeholderClassName={placeholderClassName}
        secureTextEntry={!showPassword}
        {...props}
      />
      <Pressable
        accessibilityLabel={showPassword ? "Hide password" : "Show password"}
        accessibilityRole="button"
        className="absolute top-0 right-3 flex h-10 native:h-12 web:cursor-pointer items-center justify-center"
        onPress={togglePasswordVisibility}
      >
        {showPassword ? (
          <Icon as={EyeOff} className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Icon as={Eye} className="h-4 w-4 text-muted-foreground" />
        )}
      </Pressable>
    </View>
  );
}

export { PasswordInput };
