import { describe, expect, it } from "bun:test";
import { JOBS, QUEUES } from "@universal/shared/queue";

describe("Queue constants", () => {
	it("defines a session queue", () => {
		expect(QUEUES.session).toBe("session");
	});

	it("names jobs with the queue prefix", () => {
		expect(JOBS.session.pruneExpired).toBe("session.pruneExpired");
		expect(JOBS.session.removeById).toBe("session.removeById");
	});

	it("keeps job names unique", () => {
		const names = Object.values(JOBS.session);
		expect(new Set(names).size).toBe(names.length);
	});
});
