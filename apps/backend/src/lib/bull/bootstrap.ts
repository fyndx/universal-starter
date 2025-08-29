// Import all workers to instantiate them
import './workers/session.worker';

import { sessionQueueEvents } from './queues/session.queue';

export async function startQueues() {
  await Promise.all([sessionQueueEvents.waitUntilReady()]);
}
