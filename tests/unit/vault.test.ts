import { describe, expect, it } from "@jest/globals";
import type { AnalyticsRecord } from "@/analytics/schema";
import {
  passwordsMatch,
  signVaultSession,
  verifyVaultSession,
} from "@/analytics/vault-session";
import {
  analyticsJsonPayload,
  formatAnalyticsSummary,
} from "@/analytics/vault-view";

const record: AnalyticsRecord = {
  name: "page_view",
  path: "/",
  timestamp: "2026-01-01T00:00:00.000Z",
  sessionId: "session01",
  visitorId: "visitor01",
};

describe("vault password comparison", () => {
  it("accepts the matching secret and rejects empty or wrong values", () => {
    expect(passwordsMatch("secret", "secret")).toBe(true);
    expect(passwordsMatch("secret", "other")).toBe(false);
    expect(passwordsMatch("secret", "")).toBe(false);
    expect(passwordsMatch("", "secret")).toBe(false);
  });
});

describe("vault session token", () => {
  it("accepts a fresh signature and rejects expiry or tampering", () => {
    const expiresAt = Date.now() + 60_000;
    const token = signVaultSession(expiresAt, "unit-secret");

    expect(verifyVaultSession(token, "unit-secret")).toBe(true);
    expect(verifyVaultSession(token, "other-secret")).toBe(false);
    expect(verifyVaultSession(`${expiresAt}.deadbeef`, "unit-secret")).toBe(
      false,
    );
    expect(
      verifyVaultSession(
        signVaultSession(Date.now() - 1, "unit-secret"),
        "unit-secret",
      ),
    ).toBe(false);
  });
});

describe("analytics vault views", () => {
  it("formats a summary and truncates json payloads", () => {
    const records = [
      record,
      {
        ...record,
        name: "project_view" as const,
        projectSlug: "lorem-gateway",
        path: "/projects/lorem-gateway",
      },
    ];

    expect(formatAnalyticsSummary(records)).toEqual(
      expect.arrayContaining([
        "analytics/",
        "events: 2",
        expect.stringContaining("page_view"),
        expect.stringContaining("project_view"),
      ]),
    );

    const json = analyticsJsonPayload(records);
    expect(json.count).toBe(2);
    expect(json.shown).toBe(2);
    expect(json.truncated).toBe(false);
    expect(json.events).toHaveLength(2);
  });

  it("describes an empty store", () => {
    expect(formatAnalyticsSummary([])).toEqual([
      "analytics/",
      "events: 0",
      "recent: none",
    ]);
  });
});
