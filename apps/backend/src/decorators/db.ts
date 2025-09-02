import { prisma } from '@src/infra/db';
import type Elysia from 'elysia';

export const elysiaDb = (app: Elysia) => app.decorate('db', prisma);
