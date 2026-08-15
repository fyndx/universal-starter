import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	currentItemsCount: number;
	itemName?: string;
	onPreviousPage: () => void;
	onNextPage: () => void;
}

export function Pagination({
	currentPage,
	totalPages,
	totalItems,
	currentItemsCount,
	itemName = "item",
	onPreviousPage,
	onNextPage,
}: PaginationProps) {
	const start =
		totalItems === 0 ? 0 : (currentPage - 1) * (currentItemsCount || 0) + 1;
	return (
		<div className="flex flex-col-reverse gap-4 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
			<p className="text-sm text-muted-foreground">
				Showing {start} to {start + currentItemsCount - 1} of {totalItems}{" "}
				{itemName}
				{totalItems === 1 ? "" : "s"}
			</p>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={onPreviousPage}
					disabled={currentPage <= 1}
				>
					<ChevronLeft className="h-4 w-4" />
					Previous
				</Button>
				<span className="text-sm text-muted-foreground">
					Page {currentPage} of {Math.max(totalPages, 1)}
				</span>
				<Button
					variant="outline"
					size="sm"
					onClick={onNextPage}
					disabled={currentPage >= totalPages}
				>
					Next
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
