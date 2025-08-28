import { prisma } from "@src/lib/db";
import type Elysia from "elysia";

export const elysiaDb = (app: Elysia) => app.decorate("db", prisma);
