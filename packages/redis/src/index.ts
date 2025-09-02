import { Redis, type RedisOptions } from 'ioredis';

// Creates a configurable Redis client instance with default connection from REDIS_URL.
// Use this when you need custom Redis configurations instead of the singleton client.
export const createRedisClient = (options: RedisOptions = {}) => {
  const client = new Redis(process.env.REDIS_URL as string, options);
  return client;
};

// Reusable Redis client Singleton
export const redisClient = createRedisClient();
