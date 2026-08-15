import { formatters, serializers } from "@bogeychan/elysia-logger";
import { type LoggerOptions, pino } from "pino";
import { env } from "./env";

// const LOG_TIME_FORMAT = 'HH:MM:ss'; // 24-hour format with seconds for precise debugging

const createLogger = (options?: LoggerOptions) => {
	return pino({
		level: env.LOG_LEVEL,
		// Use pretty printing in development, structured JSON in production
		// ...(process.env.NODE_ENV === 'development' && {
		//   transport: {
		//     target: 'pino-pretty',
		//     options: {
		//       colorize: true,
		//       translateTime: LOG_TIME_FORMAT,
		//       ignore: 'pid',
		//       messageFormat: true,
		//       hideObject: false,
		//     },
		//   },
		// }),
		...options,
	});
};

export const logger = createLogger({});
export const elysiaLogger = createLogger({
	formatters,
	serializers,
});
