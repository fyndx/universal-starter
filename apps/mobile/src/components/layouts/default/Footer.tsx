import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Platform, Text, View } from "react-native";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<View className="bg-background border-t border-border py-6 px-4">
			<View className="px-4">
				{/* Main Footer Content */}
				<View className="flex-col lg:flex-row flex-wrap justify-between items-start gap-6 mb-6">
					{/* Brand Section */}
					<View className="flex-1 min-w-48">
						<Link href="/">
							<View className="flex-row items-center gap-2 mb-3">
								<View className="w-8 h-8 bg-primary rounded-lg items-center justify-center">
									<Text className="text-base font-bold text-primary-foreground">
										📱
									</Text>
								</View>
								<Text className="text-lg font-semibold text-foreground">
									Universal Starter
								</Text>
							</View>
						</Link>
						<Text className="text-sm text-muted-foreground leading-5">
							A React Native app built with Expo Router that runs on iOS,
							Android, and Web.
						</Text>

						{/* Social Media Icons */}
						<View className="flex-row gap-3 mt-4">
							<Link href="/">
								<View className="w-8 h-8 bg-muted rounded-lg items-center justify-center">
									<AntDesign name="twitter" size={16} color="#6B7280" />
								</View>
							</Link>
							<Link href="/">
								<View className="w-8 h-8 bg-muted rounded-lg items-center justify-center">
									<AntDesign name="github" size={16} color="#6B7280" />
								</View>
							</Link>
							<Link href="/">
								<View className="w-8 h-8 bg-muted rounded-lg items-center justify-center">
									<AntDesign name="linkedin-square" size={16} color="#6B7280" />
								</View>
							</Link>
							<Link href="/">
								<View className="w-8 h-8 bg-muted rounded-lg items-center justify-center">
									<Feather name="globe" size={16} color="#6B7280" />
								</View>
							</Link>
						</View>
					</View>

					{/* Links Section - Only show on web for better mobile UX */}
					<View className="flex-col lg:flex-row gap-4 lg:gap-10">
						<View className="gap-3">
							<Text className="text-sm font-medium text-foreground">
								Product
							</Text>
							<View className="gap-2">
								<Link href="/">
									<Text className="text-sm text-muted-foreground">
										Features
									</Text>
								</Link>
								<Link href="/">
									<Text className="text-sm text-muted-foreground">Pricing</Text>
								</Link>
								<Link href="/">
									<Text className="text-sm text-muted-foreground">
										Documentation
									</Text>
								</Link>
							</View>
						</View>
						<View className="gap-3">
							<Text className="text-sm font-medium text-foreground">
								Company
							</Text>
							<View className="gap-2">
								<Link href="/">
									<Text className="text-sm text-muted-foreground">About</Text>
								</Link>
								<Link href="/">
									<Text className="text-sm text-muted-foreground">Blog</Text>
								</Link>
								<Link href="/">
									<Text className="text-sm text-muted-foreground">Contact</Text>
								</Link>
							</View>
						</View>
						<View className="gap-3">
							<Text className="text-sm font-medium text-foreground">
								Resources
							</Text>
							<View className="gap-2">
								<Link href="/">
									<Text className="text-sm text-muted-foreground">
										Community
									</Text>
								</Link>
								<Link href="/">
									<Text className="text-sm text-muted-foreground">Support</Text>
								</Link>
								<Link href="/">
									<Text className="text-sm text-muted-foreground">Status</Text>
								</Link>
							</View>
						</View>
					</View>
				</View>

				{/* Social Links - Responsive layout */}
				<View
					className={`flex-row justify-between items-center pt-6 border-t border-border ${
						Platform.OS === "web" ? "gap-4" : "gap-2"
					}`}
				>
					<Text className="text-xs text-muted-foreground">
						© {currentYear} Universal Starter. All rights reserved.
					</Text>

					<View className="flex-row gap-4">
						<Link href="/">
							<View className="w-6 h-6 items-center justify-center">
								<Feather name="globe" size={16} color="#6B7280" />
							</View>
						</Link>
						<Link href="/">
							<View className="w-6 h-6 items-center justify-center">
								<MaterialIcons name="email" size={16} color="#6B7280" />
							</View>
						</Link>
						<Link href="/">
							<View className="w-6 h-6 items-center justify-center">
								<MaterialIcons name="help-outline" size={16} color="#6B7280" />
							</View>
						</Link>
					</View>
				</View>
			</View>
		</View>
	);
}
