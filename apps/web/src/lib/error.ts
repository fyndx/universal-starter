/** Extracts a human-readable message from an unknown error, mirroring the mobile `getErrorMessage` helper. */
export function getErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof Error) {
		return error.message || fallback;
	}
	if (
		error &&
		typeof error === "object" &&
		"message" in error &&
		typeof (error as { message: unknown }).message === "string"
	) {
		return (error as { message: string }).message || fallback;
	}
	return fallback;
}
