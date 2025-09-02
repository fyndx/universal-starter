// biome-ignore lint/performance/noBarrelFile: This is the main entry point for the db package, centralizing Prisma client exports
export { prisma } from './client';
export type * from './generated/prisma/client';
