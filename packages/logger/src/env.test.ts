import { describe, expect, it } from "bun:test";
import { envSchema } from "./env";

describe("@universal/logger env schema", () => {
	it("defaults LOG_LEVEL to info when unset", () => {
		const result = envSchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.LOG_LEVEL).toBe("info");
		}
	});

	it("accepts all valid pino log levels", () => {
		const levels = [
			"fatal",
			"error",
			"warn",
			"info",
			"debug",
			"trace",
			"silent",
		];
		for (const level of levels) {
			const result = envSchema.safeParse({ LOG_LEVEL: level });
			expect(result.success).toBe(true);
		}
	});

	it("rejects an invalid log level", () => {
		const result = envSchema.safeParse({ LOG_LEVEL: "verbose" });
		expect(result.success).toBe(false);
	});
});
