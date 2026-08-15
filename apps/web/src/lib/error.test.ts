import { describe, expect, it } from "vitest";
import { getErrorMessage } from "@/lib/error";

describe("getErrorMessage", () => {
	it("extracts message from Error instances", () => {
		expect(getErrorMessage(new Error("boom"), "fallback")).toBe("boom");
	});

	it("extracts message from objects with a .message string", () => {
		expect(getErrorMessage({ message: "custom" }, "fallback")).toBe("custom");
	});

	it("returns fallback for unknown shapes", () => {
		expect(getErrorMessage(null, "fallback")).toBe("fallback");
		expect(getErrorMessage(undefined, "fallback")).toBe("fallback");
		expect(getErrorMessage(42, "fallback")).toBe("fallback");
	});

	it("returns fallback when Error has empty message", () => {
		expect(getErrorMessage(new Error(""), "fallback")).toBe("fallback");
	});
});
