import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  datasource: {
    // Github issue: https://github.com/prisma/prisma/issues/28590
    // url: env("DATABASE_URL"),
    url: process.env.DATABASE_URL as string,
    // shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  },
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
});
