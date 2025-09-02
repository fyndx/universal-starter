/**
 * Email Service
 *
 * A unified email service that supports multiple providers:
 * - Resend: Modern email API service
 * - Plunk: Simple email API service
 * - Nodemailer: Popular Node.js email library
 * - SMTP: Generic SMTP configuration
 *
 * Configuration is managed through environment variables.
 * Set EMAIL_PROVIDER to choose the active provider.
 */

import logger from '@universal/logger';
import { getEmailConfig } from './config';
import {
  NodemailerProvider,
  PlunkProvider,
  ResendProvider,
  SMTPProvider,
} from './providers';
import type { EmailOptions, EmailProvider, EmailResult } from './types';

// Main Email Service
class EmailService {
  private readonly provider: EmailProvider;
  private readonly config: ReturnType<typeof getEmailConfig>;

  constructor() {
    this.config = getEmailConfig();
    this.provider = this.createProvider();

    logger.info(
      {
        provider: this.config.provider,
      },
      '💌 Email service initialized with provider:'
    );
  }

  private createProvider(): EmailProvider {
    switch (this.config.provider) {
      case 'resend':
        if (!this.config.resendApiKey) {
          throw new Error('RESEND_API_KEY is required for Resend provider');
        }
        return new ResendProvider(this.config.resendApiKey);

      case 'plunk':
        if (!this.config.plunkApiKey) {
          throw new Error('PLUNK_API_KEY is required for Plunk provider');
        }
        return new PlunkProvider(this.config.plunkApiKey);

      case 'nodemailer':
        return new NodemailerProvider(this.config);

      case 'smtp':
        return new SMTPProvider(this.config);

      case 'none':
      case undefined:
      case null:
        // No-op provider - silently succeeds without sending emails
        return {
          async sendEmail(): Promise<EmailResult> {
            return await Promise.resolve({ success: true, messageId: 'no-op' });
          },
        };

      default:
        throw new Error(`Unsupported email provider: ${this.config.provider}`);
    }
  }

  private validateOptions(opts: EmailOptions): void {
    const missing = [];
    if (!opts.to) {
      missing.push('to');
    }
    if (!opts.subject) {
      missing.push('subject');
    }
    if (missing.length) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    if (!(opts.html || opts.text)) {
      throw new Error('Either html or text content is required');
    }
  }

  /**
   * Send an email using the configured provider
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      // Validate required fields
      this.validateOptions(options);
      return await this.provider.sendEmail(options);
    } catch (error) {
      logger.error({ error }, 'Error sending email:');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send a welcome email
   */
  async sendWelcomeEmail(to: string, userName: string): Promise<EmailResult> {
    return await this.sendEmail({
      to,
      subject: 'Welcome to Our App!',
      html: `
        <h1>Welcome, ${userName}!</h1>
        <p>Thank you for joining our app. We're excited to have you on board!</p>
        <p>Get started by exploring our features and let us know if you need any help.</p>
        <p>Best regards,<br>The Team</p>
      `,
      text: `Welcome, ${userName}! Thank you for joining our app. We're excited to have you on board!`,
    });
  }

  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    resetLink: string
  ): Promise<EmailResult> {
    return await this.sendEmail({
      to,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
      text: `You requested to reset your password. Click this link to reset it: ${resetLink}`,
    });
  }

  /**
   * Send an email verification email
   */
  async sendEmailVerification(
    to: string,
    verificationLink: string
  ): Promise<EmailResult> {
    return await this.sendEmail({
      to,
      subject: 'Verify Your Email Address',
      html: `
        <h1>Verify Your Email</h1>
        <p>Please click the link below to verify your email address:</p>
        <p><a href="${verificationLink}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
      text: `Please verify your email address by clicking this link: ${verificationLink}`,
    });
  }

  /**
   * Get the current provider configuration
   */
  getProviderInfo(): { provider: string; configured: boolean } {
    return {
      provider: this.config.provider,
      configured: true, // If we got here, the provider was configured successfully
    };
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export the class for testing or custom instances
export { EmailService };

// Re-export types for convenience
export type { EmailOptions, EmailResult } from './types';
