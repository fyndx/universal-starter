import { formatters, serializers } from '@bogeychan/elysia-logger';
import { type LoggerOptions, pino } from 'pino';

// const LOG_TIME_FORMAT = 'HH:MM:ss'; // 24-hour format with seconds for precise debugging

const createLogger = (options?: LoggerOptions) => {
  return pino({
    level: process.env.LOG_LEVEL || 'info',
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
