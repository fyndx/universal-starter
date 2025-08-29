import { prisma } from '@src/infra/db';
import type { Job } from 'bullmq';
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
  const raw = Number(job.data?.batchSize);
  const batchSize =
    Number.isFinite(raw) && raw > 0 ? Math.min(Math.floor(raw), 1000) : 500;
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
      orderBy: { expiresAt: 'asc' },
      select: {
        id: true,
      },
      take: batchSize,
    });

    if (expiredSessions.length === 0) {
      break;
    }

    const ids = expiredSessions.map((session) => session.id);

    const { count } = await prisma.session.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    totalDeleted += count;
    batches++;

    if (count < batchSize) {
      break;
    }
  }

  return {
    deleted: totalDeleted,
    batches,
  };
};

const processor = async (job: Job) => {
  switch (job.name) {
    case JOBS.SESSION.PRUNE_EXPIRED:
      return await processPruneExpired(
        job as Job<PruneExpiredJobData, PruneExpiredJobResult>
      );
    default:
      throw new Error(`Unknown job: ${job.name}`);
  }
};

export const sessionWorker = makeWorker({
  name: QUEUES.SESSION,
  processor,
});
