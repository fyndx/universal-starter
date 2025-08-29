import { makeQueue, makeQueueEvent } from '..';
import { JOBS, QUEUES } from '../names';

export const sessionQueue = makeQueue({ name: QUEUES.SESSION });

export const sessionQueueEvents = makeQueueEvent({ name: QUEUES.SESSION });

sessionQueueEvents.on('waiting', ({ jobId }) => {
  console.log(`A job with ID ${jobId} is waiting`);
});

sessionQueueEvents.on('active', ({ jobId, prev }) => {
  console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});

sessionQueueEvents.on('completed', ({ jobId, returnvalue }) => {
  console.log(`${jobId} has completed and returned ${returnvalue}`);
});

sessionQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.log(`${jobId} has failed with reason ${failedReason}`);
});

export const runSessionQueue = async () => {
  const job = await sessionQueue.add(JOBS.SESSION.PRUNE_EXPIRED, {
    batchSize: 2,
  });
  console.log('[session.queue] enqueued', job.id);
};
