import { makeQueue } from '@universal/queue-kit';
import { QUEUES } from '@universal/shared/queue';

export const sessionQueue = makeQueue({ name: QUEUES.session });
