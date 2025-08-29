export const QUEUES = {
  SESSION: 'session',
} as const;

export const JOBS = {
  SESSION: {
    PRUNE_EXPIRED: 'session.prune-expired',
  },
} as const;
