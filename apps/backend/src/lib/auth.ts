import { expo } from '@better-auth/expo';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, openAPI } from 'better-auth/plugins';
import { prisma } from '@/src/lib/db';
import { emailService } from './email/email-service';
import { redisConnection as redis } from './redis';

export const auth = betterAuth({
  plugins: [expo(), openAPI(), admin()],
  trustedOrigins: [
    'universalstarter://',
    'universalstarter://*',
    'https://*.expo.app',
    'https://expo.app',
    'http://localhost:8081',
  ],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
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
    cookiePrefix: 'universal-starter',
    crossSubDomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
    },
  },
  telemetry: {
    enabled: false,
  },
  secondaryStorage: {
    get: async (key) => await redis.get(key),
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(key, JSON.stringify(value), 'EX', ttl);
      } else {
        await redis.set(key, JSON.stringify(value));
      }
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
});
