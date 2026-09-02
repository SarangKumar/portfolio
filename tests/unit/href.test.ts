import { describe, expect, it } from "@jest/globals";
import { getExternalAnchorProps, isExternalHref } from "@/lib/href";

describe("isExternalHref", () => {
  it("detects absolute and contact URLs", () => {
    expect(isExternalHref("https://example.com")).toBe(true);
    expect(isExternalHref("mailto:hi@example.com")).toBe(true);
    expect(isExternalHref("/about")).toBe(false);
  });
});

describe("getExternalAnchorProps", () => {
  it("opens http(s) URLs in a new tab with a safe rel", () => {
    expect(getExternalAnchorProps("https://example.com")).toEqual({
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });

  it("does not force a new tab for mailto links", () => {
    expect(getExternalAnchorProps("mailto:hi@example.com")).toEqual({});
  });
});
