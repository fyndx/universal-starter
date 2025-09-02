// Single source of truth for queue & job names
export const QUEUES = {
  session: 'session',
} as const;

export const JOBS = {
  session: {
    pruneExpired: `${QUEUES.session}.pruneExpired`,
    removeById: `${QUEUES.session}.removeById`,
  },
} as const;

// Session
// Prune expired sessions
export type {
  PruneExpiredJobData,
  PruneExpiredJobResult,
} from './session.queue.types';
