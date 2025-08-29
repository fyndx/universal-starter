import type { Job } from 'bullmq';
import { prisma } from '../../db';
import { makeWorker } from '..';
import { JOBS, QUEUES } from '../names';

type PruneExpiredJobData = {
  batchSize: number;
};

type PruneExpiredJobResult = {
  deleted: number;
  batches: number;
};

const processPruneExpired = async (
  job: Job<PruneExpiredJobData, PruneExpiredJobResult>
) => {
  const { batchSize = 500 } = job.data;
  const now = new Date();

  let totalDeleted = 0;
  let batches = 0;

  // biome-ignore lint/nursery/noUnnecessaryConditions: batch-deletion
  while (true) {
    const expiredSessions = await prisma.session.findMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
      select: {
        id: true,
      },
      take: batchSize,
    });

    if (expiredSessions.length === 0) {
      break;
    }

    const ids = expiredSessions.map((session) => session.id);

    await prisma.session.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    totalDeleted += expiredSessions.length;
    batches++;

    if (expiredSessions.length < batchSize) {
      break;
    }
  }

  return {
    deleted: totalDeleted,
    batches,
  };
};

const jobHandlers: Record<string, (job: Job) => Promise<unknown>> = {
  [JOBS.SESSION.PRUNE_EXPIRED]: processPruneExpired,
};

const processor = async (job: Job) => {
  const handler = jobHandlers[job.name];
  if (!handler) {
    throw new Error(`Unknown job: ${job.name}`);
  }
  return await handler(job);
};

export const sessionWorker = makeWorker({
  name: QUEUES.SESSION,
  processor,
});
