import { router, useNavigation } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeToggle } from "~/components/ThemeToggle";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { Text } from "~/components/ui/text";
import { HeaderUser } from "~/containers/core/HeaderUser";
import { Sparkles } from "~/lib/icons/Sparkles";
import { cn } from "~/lib/utils";

const components: { title: string; href: string; description: string }[] = [
	{
		title: "Alert Dialog",
		href: "/alert-dialog/alert-dialog-universal",
		description:
			"A modal dialog that interrupts the user with important content and expects a response.",
	},
	{
		title: "Hover Card",
		href: "/hover-card/hover-card-universal",
		description:
			"For sighted users to preview content available behind a link.",
	},
	{
		title: "Progress",
		href: "/progress/progress-universal",
		description:
			"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
	},
	{
		title: "Scroll-area",
		href: "/scroll-area/scroll-area-universal",
		description: "Visually or semantically separates content.",
	},
	{
		title: "Tabs",
		href: "/tabs/tabs-universal",
		description:
			"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
	},
	{
		title: "Tooltip",
		href: "/tooltip/tooltip-universal",
		description:
			"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
	},
];

interface HeaderProps {
	isScrolled?: boolean;
}

export function Header({ isScrolled }: HeaderProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};
	const [value, setValue] = React.useState<string>();
	const navigation = useNavigation();

	function closeAll() {
		setValue("");
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: `navigation` is stable
	useEffect(() => {
		const sub = navigation.addListener("blur", () => {
			closeAll();
		});

		return sub;
	}, []);

	return (
		<View
			className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled
					? "bg-background/80 backdrop-blur-md border-b border-border/50"
					: "bg-transparent"
			}`}
		>
			<View className="flex-row items-center justify-between px-4 py-0 relative z-50">
				{/* Logo Section */}
				<Pressable
					onPress={() => {
						router.push("/");
					}}
					className="flex-row items-center gap-2"
				>
					<Sparkles size={24} className="text-primary" />
					<Text className="text-lg font-bold text-foreground">
						Universal Starter
					</Text>
				</Pressable>

				{/* Navigation Menu - Center */}
				<NavigationMenu
					value={value}
					onValueChange={setValue}
					className="hidden md:flex"
				>
					<NavigationMenuList>
						<NavigationMenuItem value="getting-started">
							<NavigationMenuTrigger className="bg-transparent">
								<Text>Getting started</Text>
							</NavigationMenuTrigger>
							<NavigationMenuContent insets={contentInsets}>
								<View
									role="list"
									className="web:grid gap-3 p-6 md:w-[400px] lg:w-[500px] web:lg:grid-cols-[.75fr_1fr]"
								>
									<View role="listitem" className="web:row-span-3">
										<NavigationMenuLink asChild>
											<View className="flex web:select-none flex-col justify-end rounded-md web:bg-gradient-to-b web:from-muted/50 web:to-muted native:border native:border-border p-6 web:no-underline web:outline-none web:focus:shadow-md web:focus:shadow-foreground/5">
												<Sparkles size={16} className="text-foreground" />
												<Text className="mb-2 mt-4 text-lg native:text-2xl font-medium">
													react-native-reusables
												</Text>
												<Text className="text-sm native:text-base leading-tight text-muted-foreground">
													Universal components that you can copy and paste into
													your apps. Accessible. Customizable. Open Source.
												</Text>
											</View>
										</NavigationMenuLink>
									</View>
									<ListItem href="/docs" title="Introduction">
										<Text>
											Re-usable components built using Radix UI on the web and
											Tailwind CSS.
										</Text>
									</ListItem>
									<ListItem href="/docs/installation" title="Installation">
										<Text>
											How to install dependencies and structure your app.
										</Text>
									</ListItem>
									<ListItem
										href="/docshttps://rn-primitives.vercel.app/typography"
										title="Typography"
									>
										<Text>Styles for headings, paragraphs, lists...etc</Text>
									</ListItem>
								</View>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem value="components">
							<NavigationMenuTrigger className="bg-transparent">
								<Text className="text-foreground">Components</Text>
							</NavigationMenuTrigger>
							<NavigationMenuContent insets={contentInsets}>
								<View
									role="list"
									className="web:grid w-[400px] gap-3 p-4 md:w-[500px] web:md:grid-cols-2 lg:w-[600px] "
								>
									{components.map((component) => (
										<ListItem
											key={component.title}
											title={component.title}
											href={component.href}
										>
											{component.description}
										</ListItem>
									))}
								</View>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem value="documentation">
							<NavigationMenuLink
								onPress={closeAll}
								className={`${navigationMenuTriggerStyle()} bg-transparent`}
							>
								<Text>Documentation</Text>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
				{/* Right Section - Theme Toggle & Login */}
				<View className="flex-row items-center gap-2">
					<ThemeToggle />
					<HeaderUser />
				</View>
			</View>
		</View>
	);
}

const ListItem = ({
	className,
	title,
	children,
	ref,
	...props
}: React.ComponentPropsWithoutRef<typeof Text> & {
	title: string;
	href: string;
	ref?: React.Ref<View>;
}) => {
	// TODO: add navigationn to `href` on `NavigationMenuLink` onPress
	return (
		<View role="listitem">
			<NavigationMenuLink
				ref={ref}
				className={cn(
					"web:block web:select-none gap-1 rounded-md p-3 leading-none no-underline text-foreground web:outline-none web:transition-colors web:hover:bg-accent active:bg-accent web:hover:text-accent-foreground web:focus:bg-accent web:focus:text-accent-foreground",
					className,
				)}
				{...props}
			>
				<Text className="text-sm native:text-base font-medium text-foreground leading-none">
					{title}
				</Text>
				<Text className="line-clamp-2 text-sm native:text-base leading-snug text-muted-foreground">
					{children}
				</Text>
			</NavigationMenuLink>
		</View>
	);
};

ListItem.displayName = "ListItem";
