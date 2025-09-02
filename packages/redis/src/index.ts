import { Redis, type RedisOptions } from 'ioredis';

// Create a new Redis client
export const createRedisClient = (options: RedisOptions = {}) => {
  const client = new Redis(process.env.REDIS_URL as string, options);
  return client;
};

// Reusable Redis client Singleton
export const redisClient = createRedisClient();
