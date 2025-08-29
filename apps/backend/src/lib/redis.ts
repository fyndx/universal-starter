import IORedis, { type RedisOptions } from 'ioredis';

// Create a new Redis client
export function createRedisClient(options: RedisOptions = {}) {
  return new IORedis(process.env.REDIS_URL as string, options);
}

// Reusable Redis connection
export const redisConnection = createRedisClient();
