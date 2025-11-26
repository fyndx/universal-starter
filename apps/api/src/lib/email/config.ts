/**
 * Email Configuration
 *
 * Environment-based configuration for email service
 */

import { env } from "@src/env";
import type { EmailConfig } from "./types";

export const getEmailConfig = (): EmailConfig => {
	const config = {
		provider: env.EMAIL_PROVIDER as EmailConfig["provider"],
		from: env.EMAIL_FROM,
		fromName: env.EMAIL_FROM_NAME,

		// Resend
		resendApiKey: env.RESEND_API_KEY,

		// Plunk
		plunkApiKey: env.PLUNK_API_KEY,

		// SMTP
		smtpHost: env.SMTP_HOST,
		smtpPort: env.SMTP_PORT ?? 587,
		smtpSecure: env.SMTP_SECURE ?? false,
		smtpUser: env.SMTP_USER,
		smtpPass: env.SMTP_PASS,

		// Nodemailer
		nodemailerService: env.NODEMAILER_SERVICE,
		nodemailerUser: env.NODEMAILER_USER,
		nodemailerPass: env.NODEMAILER_PASS,
	};

	return config;
};
