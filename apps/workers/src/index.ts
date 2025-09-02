import { logger } from '@universal/logger';

try {
  await import('./session.worker');
  // Add more worker imports here

  logger.info('Workers initialized successfully');
} catch (error) {
  logger.error({ error }, 'Failed to initialize workers');
  process.exit(1);
}
