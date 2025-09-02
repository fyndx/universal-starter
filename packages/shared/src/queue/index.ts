// Single source of truth for queue & job names
export const QUEUES = {
  session: 'session',
} as const;

export const JOBS = {
  session: {
    pruneExpired: 'session.pruneExpired',
    removeById: 'session.removeById',
  },
} as const;
