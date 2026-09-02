import { describe, expect, it } from "@jest/globals";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
