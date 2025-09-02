import { createRedisClient, redisClient } from '@universal/redis';
import {
  type Job,
  Queue,
  QueueEvents,
  type QueueEventsOptions,
  type QueueOptions,
  Worker,
  type WorkerOptions,
} from 'bullmq';

export function makeQueue<TData>({
  name,
  config,
}: {
  name: string;
  config?: QueueOptions;
}) {
  const queue = new Queue<TData>(name, {
    defaultJobOptions: {
      attempts: 10,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    },
    connection: redisClient,
    ...config,
  });
  return queue;
}

export function makeWorker<TData, TReturn, N extends string = string>({
  name,
  processor,
  config,
}: {
  name: string;
  processor: (job: Job<TData>) => Promise<TReturn>;
  config?: WorkerOptions;
}) {
  const worker = new Worker<TData, TReturn, N>(name, processor, {
    connection: createRedisClient({ maxRetriesPerRequest: null }),
    ...config,
  });
  return worker;
}

export function makeQueueEvent({
  name,
  config,
}: {
  name: string;
  config?: QueueEventsOptions;
}) {
  return new QueueEvents(name, {
    connection: createRedisClient({ maxRetriesPerRequest: null }),
    ...config,
  });
}
