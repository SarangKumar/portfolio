import { describe, expect, it } from "@jest/globals";
import { defaultResume } from "@/lib/resume";

describe("defaultResume", () => {
  it("prefers the marked default version and falls back to the first entry", () => {
    expect(
      defaultResume([
        {
          id: "general",
          label: "General",
          overview: null,
          previewSrc: null,
          previewKind: null,
          fileSrc: null,
          fileName: null,
          isDefault: false,
        },
        {
          id: "backend",
          label: "Backend",
          overview: null,
          previewSrc: null,
          previewKind: null,
          fileSrc: null,
          fileName: null,
          isDefault: true,
        },
      ])?.id,
    ).toBe("backend");

    expect(
      defaultResume([
        {
          id: "only",
          label: "Only",
          overview: null,
          previewSrc: null,
          previewKind: null,
          fileSrc: null,
          fileName: null,
          isDefault: false,
        },
      ])?.id,
    ).toBe("only");

    expect(defaultResume([])).toBeUndefined();
  });
});
