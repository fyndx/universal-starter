import {
  type Job,
  Queue,
  QueueEvents,
  type QueueEventsOptions,
  type QueueOptions,
  Worker,
  type WorkerOptions,
} from 'bullmq';
import { createRedisClient, redisConnection } from '../redis';

export function makeQueue<TData>({
  name,
  config,
}: {
  name: string;
  config?: QueueOptions;
}) {
  const queue = new Queue<TData>(name, {
    connection: redisConnection,
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
  return new Worker<TData, TReturn, N>(name, processor, {
    connection: createRedisClient({ maxRetriesPerRequest: null }),
    ...config,
  });
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
