import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
	it("merges class names", () => {
		expect(cn("px-2", "py-1")).toBe("px-2 py-1");
	});

	it("handles conditional classes", () => {
		expect(cn("base", false && "hidden", "visible")).toBe("base visible");
	});

	it("deduplicates conflicting tailwind classes (last wins)", () => {
		expect(cn("px-2", "px-4")).toBe("px-4");
	});

	it("handles empty inputs", () => {
		expect(cn()).toBe("");
	});
});
