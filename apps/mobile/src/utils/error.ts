/**
 * Gets standardized error message from unknown error type
 * @param error - The error object (can be Error, string, or unknown)
 * @param fallback - Fallback message if error cannot be parsed
 * @returns Standardized error message string
 */
export function getErrorMessage(error: unknown, fallback: string): string {
	return error instanceof Error ? error.message : fallback;
}