/**
 * SMTP Email Provider
 *
 * Generic SMTP configuration provider (extends NodemailerProvider)
 */

import type { EmailConfig } from "../types";
import { NodemailerProvider } from "./nodemailer";

export class SMTPProvider extends NodemailerProvider {
	constructor(config: EmailConfig) {
		// SMTP is handled by NodemailerProvider with SMTP configuration
		super(config);
	}
}
