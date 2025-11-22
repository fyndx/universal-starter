import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
});

export const env = envSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
});
