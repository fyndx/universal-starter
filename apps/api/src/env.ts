import { logger } from "@universal/logger";
import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),

  // Auth
  BETTER_AUTH_SECRET: z.string().min(1),

  // Email Service Configuration
  EMAIL_PROVIDER: z.enum(["nodemailer", "resend", "plunk", "smtp"]),

  // Resend Configuration
  RESEND_API_KEY: z.string().optional(),

  // Plunk Configuration
  PLUNK_API_KEY: z.string().optional(),

  // SMTP Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z
    .string()
    .transform((s) => s === "true")
    .optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Nodemailer Configuration
  NODEMAILER_SERVICE: z.string().optional(),
  NODEMAILER_USER: z.string().optional(),
  NODEMAILER_PASS: z.string().optional(),

  // Default sender configuration
  EMAIL_FROM: z.email(),
  EMAIL_FROM_NAME: z.string().min(1),

  // Observability
  AXIOM_DOMAIN: z.url().optional(),
  AXIOM_TOKEN: z.string().optional(),
  DATASET_NAME: z.string().optional(),

  // Redis
  REDIS_URL: z.url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error("❌ Invalid environment variables:");
  logger.error(JSON.stringify(z.flattenError(parsed.error).fieldErrors, null, 2));
  process.exit(1);
}

export const env = parsed.data;
