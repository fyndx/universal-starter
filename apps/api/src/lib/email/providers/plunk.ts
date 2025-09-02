/**
 * Plunk Email Provider
 *
 * Simple email API service provider
 */

import { getEmailConfig } from "../config";
import type { EmailOptions, EmailProvider, EmailResult } from "../types";

export class PlunkProvider implements EmailProvider {
	private apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	async sendEmail(options: EmailOptions): Promise<EmailResult> {
		try {
			const config = getEmailConfig();
			const response = await fetch("https://api.useplunk.com/v1/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					to: Array.isArray(options.to) ? options.to[0] : options.to, // Plunk supports single recipient
					subject: options.subject,
					body: options.html || options.text,
					type: options.html ? "html" : "text",
					name: options.fromName || config.fromName,
					from: options.from || config.from,
				}),
			});

			if (!response.ok) {
				throw new Error(`Plunk API error: ${response.statusText}`);
			}

			const result = await response.json();

			return {
				success: true,
				messageId: result.id,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}
