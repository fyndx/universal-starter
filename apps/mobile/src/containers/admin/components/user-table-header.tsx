import * as React from "react";
import { TableHead, TableRow } from "~/components/ui/table";
import { Text } from "~/components/ui/text";

interface UserTableHeaderProps {
	columnWidths: number[];
}

const COLUMN_HEADERS = [
	"Name",
	"Email",
	"Verification",
	"Linked Accounts",
	"Role",
	"Status",
	"Last Sign In",
	"Created At",
	"Actions",
];

export const UserTableHeader = React.memo(
	({ columnWidths }: UserTableHeaderProps) => {
		return (
			<TableRow>
				{COLUMN_HEADERS.map((header, index) => (
					<TableHead key={header} style={{ width: columnWidths[index] }}>
						<Text>{header}</Text>
					</TableHead>
				))}
			</TableRow>
		);
	},
);

UserTableHeader.displayName = "UserTableHeader";
