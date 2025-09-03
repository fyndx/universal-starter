/**
 * Resend Email Provider
 *
 * Modern email API service provider
 */

import { Resend } from "resend";
import { getEmailConfig } from "../config";
import type { EmailOptions, EmailProvider, EmailResult } from "../types";

export class ResendProvider implements EmailProvider {
	private resend: Resend;

	constructor(apiKey: string) {
		this.resend = new Resend(apiKey);
	}

	async sendEmail(options: EmailOptions): Promise<EmailResult> {
		try {
			const config = getEmailConfig();
			const result = await this.resend.emails.send({
				from: options.from || `${config.fromName} <${config.from}>`,
				to: Array.isArray(options.to) ? options.to : [options.to],
				subject: options.subject,
				html: options.html,
				text: options.text,
				attachments: options.attachments?.map((att) => ({
					filename: att.filename,
					content: att.content,
				})),
			});

			return {
				success: true,
				messageId: result.data?.id,
			};
		} catch (error) {
			console.error("Error sending email with Resend:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}
