import { pino } from 'pino';

const LOG_TIME_FORMAT = 'HH:MM:ss'; // 24-hour format with seconds for precise debugging

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Use pretty printing in development, structured JSON in production
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: LOG_TIME_FORMAT,
        ignore: 'pid',
        messageFormat: true,
        hideObject: false,
      },
    },
  }),
});

export default logger;
