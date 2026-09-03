import { describe, expect, it } from "@jest/globals";
import { defaultResume } from "@/lib/resume";

describe("defaultResume", () => {
  it("prefers the marked default version and falls back to the first entry", () => {
    expect(
      defaultResume([
        {
          id: "general",
          label: "General",
          targetType: "general",
          overview: null,
          notes: null,
          previewSrc: null,
          previewKind: null,
          fileSrc: null,
          fileName: null,
          isDefault: false,
          createdAt: null,
          updatedAt: null,
        },
        {
          id: "backend",
          label: "Backend",
          targetType: "backend",
          overview: null,
          notes: null,
          previewSrc: null,
          previewKind: null,
          fileSrc: null,
          fileName: null,
          isDefault: true,
          createdAt: null,
          updatedAt: null,
        },
      ])?.id,
    ).toBe("backend");

    expect(
      defaultResume([
        {
          id: "only",
          label: "Only",
          targetType: "general",
          overview: null,
          notes: null,
          previewSrc: null,
          previewKind: null,
          fileSrc: null,
          fileName: null,
          isDefault: false,
          createdAt: null,
          updatedAt: null,
        },
      ])?.id,
    ).toBe("only");

    expect(defaultResume([])).toBeUndefined();
  });
});
