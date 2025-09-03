/**
 * Email Configuration
 *
 * Environment-based configuration for email service
 */

import type { EmailConfig } from "./types";

export const getEmailConfig = (): EmailConfig => {
	const config = {
		provider: process.env.EMAIL_PROVIDER as EmailConfig["provider"],
		from: process.env.EMAIL_FROM || "onboarding@resend.dev",
		fromName: process.env.EMAIL_FROM_NAME || "Universal Expo App",

		// Resend
		resendApiKey: process.env.RESEND_API_KEY,

		// Plunk
		plunkApiKey: process.env.PLUNK_API_KEY,

		// SMTP
		smtpHost: process.env.SMTP_HOST,
		smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
		smtpSecure: process.env.SMTP_SECURE === "true",
		smtpUser: process.env.SMTP_USER,
		smtpPass: process.env.SMTP_PASS,

		// Nodemailer
		nodemailerService: process.env.NODEMAILER_SERVICE,
		nodemailerUser: process.env.NODEMAILER_USER,
		nodemailerPass: process.env.NODEMAILER_PASS,
	};

	return config;
};
