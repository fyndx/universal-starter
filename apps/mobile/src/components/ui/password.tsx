import { Eye, EyeOff } from "lucide-react-native";
import * as React from "react";
import {
	Pressable,
	type TextInput,
	type TextInputProps,
	View,
} from "react-native";
import { Input } from "./input";

interface PasswordInputProps extends Omit<TextInputProps, "secureTextEntry"> {
	ref?: React.RefObject<TextInput>;
}

function PasswordInput({
	className,
	placeholderClassName,
	...props
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = React.useState(false);

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
				className="absolute right-3 top-0 h-10 native:h-12 flex items-center justify-center web:cursor-pointer"
				onPress={togglePasswordVisibility}
				accessibilityLabel={showPassword ? "Hide password" : "Show password"}
				accessibilityRole="button"
			>
				{showPassword ? (
					<EyeOff className="h-4 w-4 text-muted-foreground" />
				) : (
					<Eye className="h-4 w-4 text-muted-foreground" />
				)}
			</Pressable>
		</View>
	);
}

export { PasswordInput };
