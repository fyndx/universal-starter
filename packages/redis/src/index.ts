import { logger } from "@universal/logger";
import { Redis, type RedisOptions } from "ioredis";
import { env } from "./env";

// Creates a configurable Redis client instance with default connection from REDIS_URL.
// Use this when you need custom Redis configurations instead of the singleton client.
export const createRedisClient = (options: RedisOptions = {}) => {
	const client = new Redis(env.REDIS_URL, options);
	client.on("error", (error) => {
		logger.error(
			{
				error,
			},
			"Redis Client Error",
		);
	});
	client.on("connect", () => {
		logger.info("Redis client connected");
	});
	client.on("ready", () => {
		logger.info("Redis client ready");
	});
	client.on("close", () => {
		logger.info("Redis client closed");
	});
	client.on("reconnecting", () => {
		logger.info("Redis client reconnecting");
	});
	client.on("end", () => {
		logger.info("Redis client disconnected");
	});
	return client;
};

// Reusable Redis client Singleton
export const redisClient = createRedisClient();
