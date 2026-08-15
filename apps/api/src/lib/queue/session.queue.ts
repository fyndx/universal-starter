import { makeQueue } from "@universal/queue-kit";
import { QUEUES } from "@universal/shared/queue";

export const sessionQueue: ReturnType<typeof makeQueue> = makeQueue({
	name: QUEUES.session,
});
