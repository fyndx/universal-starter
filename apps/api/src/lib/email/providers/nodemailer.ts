/**
 * Nodemailer Email Provider
 *
 * Popular Node.js email library provider
 */

import nodemailer from "nodemailer";
import { getEmailConfig } from "../config";
import type {
	EmailConfig,
	EmailOptions,
	EmailProvider,
	EmailResult,
} from "../types";

export class NodemailerProvider implements EmailProvider {
	private transporter: nodemailer.Transporter;

	constructor(config: EmailConfig) {
		if (config.nodemailerService) {
			// Use service-based configuration (Gmail, Outlook, etc.)
			this.transporter = nodemailer.createTransporter({
				service: config.nodemailerService,
				auth: {
					user: config.nodemailerUser,
					pass: config.nodemailerPass,
				},
			});
		} else {
			// Use SMTP configuration
			this.transporter = nodemailer.createTransporter({
				host: config.smtpHost,
				port: config.smtpPort || 587,
				secure: config.smtpSecure || false,
				auth: {
					user: config.smtpUser,
					pass: config.smtpPass,
				},
			});
		}
	}

	async sendEmail(options: EmailOptions): Promise<EmailResult> {
		try {
			const config = getEmailConfig();
			const result = await this.transporter.sendMail({
				from:
					options.from ||
					`${options.fromName || config.fromName} <${config.from}>`,
				to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
				subject: options.subject,
				html: options.html,
				text: options.text,
				attachments: options.attachments?.map((att) => ({
					filename: att.filename,
					content: att.content,
					contentType: att.contentType,
				})),
			});

			return {
				success: true,
				messageId: result.messageId,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}
