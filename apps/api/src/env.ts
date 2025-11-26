import { logger } from "@universal/logger";
import { z } from "zod";

export const envSchema = z
  .object({
    // Database
    DATABASE_URL: z.string().min(1),

    // Auth
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    FACEBOOK_CLIENT_ID: z.string().min(1).optional(),
    FACEBOOK_CLIENT_SECRET: z.string().min(1).optional(),
    GITHUB_CLIENT_ID: z.string().min(1).optional(),
    GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
    APPLE_CLIENT_ID: z.string().min(1).optional(),
    APPLE_CLIENT_SECRET: z.string().min(1).optional(),
    LINKEDIN_CLIENT_ID: z.string().min(1).optional(),
    LINKEDIN_CLIENT_SECRET: z.string().min(1).optional(),

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

    // Node_env
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  })
  .superRefine((data, ctx) => {
    const providers = [
      {
        name: "Google",
        id: data.GOOGLE_CLIENT_ID,
        secret: data.GOOGLE_CLIENT_SECRET,
        idKey: "GOOGLE_CLIENT_ID",
        secretKey: "GOOGLE_CLIENT_SECRET",
      },
      {
        name: "Facebook",
        id: data.FACEBOOK_CLIENT_ID,
        secret: data.FACEBOOK_CLIENT_SECRET,
        idKey: "FACEBOOK_CLIENT_ID",
        secretKey: "FACEBOOK_CLIENT_SECRET",
      },
      {
        name: "GitHub",
        id: data.GITHUB_CLIENT_ID,
        secret: data.GITHUB_CLIENT_SECRET,
        idKey: "GITHUB_CLIENT_ID",
        secretKey: "GITHUB_CLIENT_SECRET",
      },
      {
        name: "Apple",
        id: data.APPLE_CLIENT_ID,
        secret: data.APPLE_CLIENT_SECRET,
        idKey: "APPLE_CLIENT_ID",
        secretKey: "APPLE_CLIENT_SECRET",
      },
      {
        name: "LinkedIn",
        id: data.LINKEDIN_CLIENT_ID,
        secret: data.LINKEDIN_CLIENT_SECRET,
        idKey: "LINKEDIN_CLIENT_ID",
        secretKey: "LINKEDIN_CLIENT_SECRET",
      },
    ];

    for (const provider of providers) {
      if (
        (provider.id && !provider.secret) ||
        (!provider.id && provider.secret)
      ) {
        ctx.addIssue({
          code: "custom",
          message: `${provider.name} requires both Client ID and Client Secret to be set, or neither.`,
          path: [provider.id ? provider.secretKey : provider.idKey],
        });
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error("❌ Invalid environment variables:");
  logger.error(
    JSON.stringify(z.flattenError(parsed.error).fieldErrors, null, 2)
  );
  process.exit(1);
}

export const env = parsed.data;
