import { expo } from "@better-auth/expo";
import { prisma } from "@src/infra/db";
import { redisClient as redis } from "@universal/redis";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, openAPI } from "better-auth/plugins";
import { env } from "@src/env";
import { emailService } from "./email/email-service";

export const auth = betterAuth({
  // basePath: "/auth",
  plugins: [expo(), openAPI(), admin()],
  trustedOrigins: [
    "universalstarter://",
    "universalstarter://*",
    "https://*.expo.app",
    "https://expo.app",
    "http://localhost:8081",

    // Development mode - Expo's exp:// scheme with local IP ranges
    ...(env.NODE_ENV === "development" ? [
        "exp://*/*",                 // Trust all Expo development URLs
        "exp://10.0.0.*:*/*",        // Trust 10.0.0.x IP range
        "exp://192.168.*.*:*/*",     // Trust 192.168.x.x IP range
        "exp://172.*.*.*:*/*",       // Trust 172.x.x.x IP range
        "exp://localhost:*/*"        // Trust localhost
    ] : [])
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      prompt: "select_account", 
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
    facebook: {
      clientId: env.FACEBOOK_CLIENT_ID || "",
      clientSecret: env.FACEBOOK_CLIENT_SECRET || "",
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID || "",
      clientSecret: env.GITHUB_CLIENT_SECRET || "",
    },
    apple: {
      clientId: env.APPLE_CLIENT_ID || "",
      clientSecret: env.APPLE_CLIENT_SECRET || "",
    },
    linkedin: {
      clientId: env.LINKEDIN_CLIENT_ID || "",
      clientSecret: env.LINKEDIN_CLIENT_SECRET || "",
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      await emailService.sendPasswordResetEmail(user.email, url);
    },
    onPasswordReset: async ({ user }, request) => {
      // TODO: inform user about password reset
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await emailService.sendEmailVerification(user.email, url);
    },
    sendOnSignUp: true,
  },
  advanced: {
    cookiePrefix: "universal-starter",
    crossSubDomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
  telemetry: {
    enabled: false,
  },
  secondaryStorage: {
    get: async (key) => {
      const value = await redis.get(key);
      return value ? value : null;
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(key, value, "EX", ttl);
      } else {
        await redis.set(key, value);
      }
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
});
