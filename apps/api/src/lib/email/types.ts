/**
 * Email Service Types
 *
 * Shared interfaces and types for the email service
 */

export interface EmailOptions {
	to: string | string[];
	subject: string;
	html?: string;
	text?: string;
	from?: string;
	fromName?: string;
	attachments?: Array<{
		filename: string;
		content: Buffer | string;
		contentType?: string;
	}>;
}

export interface EmailResult {
	success: boolean;
	messageId?: string;
	error?: string;
}

export interface EmailConfig {
	provider: "resend" | "plunk" | "nodemailer" | "smtp" | "none";
	from: string;
	fromName: string;

	// Resend config
	resendApiKey?: string;

	// Plunk config
	plunkApiKey?: string;

	// SMTP config
	smtpHost?: string;
	smtpPort?: number;
	smtpSecure?: boolean;
	smtpUser?: string;
	smtpPass?: string;

	// Nodemailer config
	nodemailerService?: string;
	nodemailerUser?: string;
	nodemailerPass?: string;
}

export interface EmailProvider {
	sendEmail(options: EmailOptions): Promise<EmailResult>;
}
