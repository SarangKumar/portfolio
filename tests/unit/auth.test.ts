import { describe, expect, it } from "@jest/globals";
import { signAdminSession, verifyAdminSession } from "@/auth/admin-session";
import { isPrivatePath, unlockRedirectPath } from "@/auth/paths";
import { safeInternalPath } from "@/auth/redirect";

const SECRET = "test-secret-with-enough-length";
const NOW = Date.parse("2026-10-11T12:00:00.000Z");
const LATER = NOW + 60_000;

describe("admin session cookie", () => {
  it("accepts a freshly signed token before it expires", () => {
    const token = signAdminSession(NOW + 1_000, SECRET);
    expect(verifyAdminSession(token, SECRET, NOW)).toBe(true);
  });

  it("rejects an expired token", () => {
    const token = signAdminSession(NOW - 1, SECRET);
    expect(verifyAdminSession(token, SECRET, NOW)).toBe(false);
  });

  it("rejects a token signed with a different secret", () => {
    const token = signAdminSession(NOW + 1_000, "another-secret-value");
    expect(verifyAdminSession(token, SECRET, NOW)).toBe(false);
  });

  it("rejects a token whose expiry was edited after signing", () => {
    const [, signature] = signAdminSession(NOW + 1_000, SECRET).split(".");
    const forged = `${NOW + 9_999_999}.${signature}`;
    expect(verifyAdminSession(forged, SECRET, NOW)).toBe(false);
  });

  it("rejects missing, malformed or trailing-garbage tokens", () => {
    const token = signAdminSession(NOW + 1_000, SECRET);
    expect(verifyAdminSession(undefined, SECRET, NOW)).toBe(false);
    expect(verifyAdminSession("", SECRET, NOW)).toBe(false);
    expect(verifyAdminSession("not-a-token", SECRET, NOW)).toBe(false);
    expect(verifyAdminSession(`${token}.extra`, SECRET, NOW)).toBe(false);
  });

  it("never verifies when no secret is configured", () => {
    const token = signAdminSession(LATER + 1_000, "");
    expect(verifyAdminSession(token, "", LATER)).toBe(false);
  });
});

describe("private route gating", () => {
  it("treats /admin and nested admin paths as private, with or without a locale", () => {
    expect(isPrivatePath("/admin")).toBe(true);
    expect(isPrivatePath("/admin/projects")).toBe(true);
    expect(isPrivatePath("/en/admin/projects")).toBe(true);
    expect(isPrivatePath("/administrator")).toBe(false);
    expect(isPrivatePath("/unlock")).toBe(false);
  });

  it("sends locked visitors to the unlock page with the original path", () => {
    expect(unlockRedirectPath("/admin/projects")).toBe(
      "/unlock?callbackUrl=%2Fadmin%2Fprojects",
    );
  });
});

describe("post-unlock redirects", () => {
  it("only follows same-origin paths", () => {
    expect(safeInternalPath("/admin/projects")).toBe("/admin/projects");
    expect(safeInternalPath("https://evil.example")).toBe("/admin");
    expect(safeInternalPath("//evil.example")).toBe("/admin");
  });

  it("never sends the user back into the unlock page or the API", () => {
    expect(safeInternalPath("/unlock")).toBe("/admin");
    expect(safeInternalPath("/api/analytics")).toBe("/admin");
  });
});
