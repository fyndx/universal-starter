import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	currentItemsCount: number;
	itemName?: string;
	onPreviousPage?: () => void;
	onNextPage?: () => void;
}

export const Pagination = React.memo(
	({
		currentPage,
		totalPages,
		totalItems,
		currentItemsCount,
		itemName = "item",
		onPreviousPage,
		onNextPage,
	}: PaginationProps) => {
		const itemText = currentItemsCount !== 1 ? `${itemName}s` : itemName;

		return (
			<View className="items-center py-4 ios:pb-0 space-y-3">
				<Text className="text-sm text-muted-foreground">
					{`${currentItemsCount} ${itemText} of ${totalItems} total`}
				</Text>

				{totalPages > 1 && (
					<View className="flex-row items-center space-x-4">
						<Text className="text-sm text-muted-foreground">
							Page {currentPage} of {totalPages}
						</Text>

						<View className="flex-row space-x-2">
							<View
								className={cn(
									"bg-primary rounded px-3 py-1",
									currentPage === 1 ? "opacity-50" : "opacity-100",
								)}
								onTouchEnd={currentPage > 1 ? onPreviousPage : undefined}
							>
								<Text className="text-primary-foreground text-sm">
									Previous
								</Text>
							</View>
							<View
								className={cn(
									"bg-primary rounded px-3 py-1",
									currentPage === totalPages ? "opacity-50" : "opacity-100",
								)}
								onTouchEnd={currentPage < totalPages ? onNextPage : undefined}
							>
								<Text className="text-primary-foreground text-sm">Next</Text>
							</View>
						</View>
					</View>
				)}
			</View>
		);
	},
);

Pagination.displayName = "Pagination";
