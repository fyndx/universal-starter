import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string(),
  EXPO_PUBLIC_STORAGE_PREFIX: z.string().min(2).max(100),
});

export const env = envSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_STORAGE_PREFIX: process.env.EXPO_PUBLIC_STORAGE_PREFIX,
});
