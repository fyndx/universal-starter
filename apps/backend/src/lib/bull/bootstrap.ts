// Import all workers to instantiate them
import './workers/session.worker';

// TODO:
// export async function initializeWorkers() {
//   await import('./workers/session.worker');
// }

import { sessionQueueEvents } from './queues/session.queue';

export async function startQueues() {
  await Promise.all([sessionQueueEvents.waitUntilReady()]);
}
