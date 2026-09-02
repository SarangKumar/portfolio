import { afterEach, describe, expect, it, jest } from "@jest/globals";
import {
  analyticsEvents,
  noopAnalytics,
  outboundAnalyticsEvent,
  setAnalyticsClient,
  track,
  trackBlogView,
  trackContactSubmit,
  trackPageView,
  trackProjectView,
  trackResumeEvent,
} from "@/analytics/events";
import { ingestAnalyticsEvent } from "@/analytics/ingest";
import {
  analyticsCookieNames,
  resolveAnalyticsIdentity,
} from "@/analytics/identity";
import {
  getProjectViewCounts,
  mergeProjectViewCounts,
  resetProjectPopularitySource,
  setProjectPopularitySource,
} from "@/analytics/popularity";
import { MemoryRateLimiter } from "@/analytics/rate-limit";
import {
  parseAnalyticsRecord,
  serializeAnalyticsRecord,
  validateAnalyticsPayload,
} from "@/analytics/schema";
import {
  countProjectViews,
  MemoryAnalyticsStore,
  resetAnalyticsStore,
  setAnalyticsStore,
} from "@/analytics/store";

const originalFetch = global.fetch;

const identity = {
  sessionId: "session-token-aaaa",
  visitorId: "visitor-token-bbbb",
};

afterEach(() => {
  setAnalyticsClient(noopAnalytics);
  setAnalyticsClient(null);
  resetAnalyticsStore();
  resetProjectPopularitySource();
  global.fetch = originalFetch;
});

describe("analytics event names", () => {
  it("uses the Phase 1 public event vocabulary", () => {
    expect(analyticsEvents.pageView).toBe("page_view");
    expect(analyticsEvents.projectView).toBe("project_view");
    expect(analyticsEvents.resumeView).toBe("resume_view");
    expect(analyticsEvents.resumeDownload).toBe("resume_download");
    expect(analyticsEvents.blogView).toBe("blog_view");
    expect(analyticsEvents.githubClick).toBe("github_click");
    expect(analyticsEvents.linkedinClick).toBe("linkedin_click");
    expect(analyticsEvents.emailClick).toBe("email_click");
    expect(analyticsEvents.terminalOpen).toBe("terminal_open");
    expect(analyticsEvents.terminalCommand).toBe("terminal_command");
    expect(analyticsEvents.contactSubmit).toBe("contact_submit");
  });
});

describe("validateAnalyticsPayload", () => {
  it("accepts a valid project_view", () => {
    expect(
      validateAnalyticsPayload({
        name: "project_view",
        path: "/projects/sample-app?ref=nav",
        projectSlug: "sample-app",
      }),
    ).toEqual({
      ok: true,
      value: {
        name: "project_view",
        path: "/projects/sample-app",
        projectSlug: "sample-app",
      },
    });
  });

  it("rejects unknown events, extra fields, and PII-shaped metadata", () => {
    expect(validateAnalyticsPayload({ name: "click", path: "/" })).toEqual({
      ok: false,
      error: "invalid_name",
    });
    expect(
      validateAnalyticsPayload({
        name: "page_view",
        path: "/",
        email: "ada@example.com",
      }),
    ).toEqual({ ok: false, error: "unexpected_field" });
    expect(
      validateAnalyticsPayload({
        name: "contact_submit",
        path: "/contact",
        metadata: { email: "ada@example.com" },
      }),
    ).toEqual({ ok: false, error: "invalid_metadata" });
    expect(
      validateAnalyticsPayload({
        name: "project_view",
        path: "/projects/sample-app",
      }),
    ).toEqual({ ok: false, error: "missing_project_slug" });
  });

  it("does not trust client timestamps", () => {
    expect(
      validateAnalyticsPayload({
        name: "page_view",
        path: "/",
        timestamp: "2020-01-01T00:00:00.000Z",
      }),
    ).toEqual({ ok: false, error: "unexpected_field" });
  });
});

describe("event serialization", () => {
  it("round-trips a stored record", () => {
    const serialized = serializeAnalyticsRecord({
      name: "blog_view",
      path: "/blog/public-note",
      blogSlug: "public-note",
      timestamp: "2024-01-15T00:00:00.000Z",
      sessionId: identity.sessionId,
      visitorId: identity.visitorId,
    });

    expect(parseAnalyticsRecord(serialized)).toEqual({
      ok: true,
      value: {
        name: "blog_view",
        path: "/blog/public-note",
        blogSlug: "public-note",
        timestamp: "2024-01-15T00:00:00.000Z",
        sessionId: identity.sessionId,
        visitorId: identity.visitorId,
      },
    });
    expect(parseAnalyticsRecord("{not json")).toEqual({
      ok: false,
      error: "invalid_json",
    });
  });
});

describe("ingestAnalyticsEvent", () => {
  it("stores valid events with server identity", async () => {
    const store = new MemoryAnalyticsStore();
    const limiter = new MemoryRateLimiter(10, 60_000);
    const now = new Date("2024-02-02T12:00:00.000Z");

    const result = await ingestAnalyticsEvent(
      {
        name: "page_view",
        path: "/about",
      },
      { identity, store, limiter, now },
    );

    expect(result).toEqual({ accepted: true });
    expect(store.list()).toEqual([
      {
        name: "page_view",
        path: "/about",
        timestamp: "2024-02-02T12:00:00.000Z",
        sessionId: identity.sessionId,
        visitorId: identity.visitorId,
      },
    ]);
  });

  it("drops invalid events and store failures without throwing", async () => {
    const limiter = new MemoryRateLimiter(10, 60_000);

    await expect(
      ingestAnalyticsEvent({ name: "nope", path: "/" }, { identity, limiter }),
    ).resolves.toEqual({ accepted: false, reason: "invalid" });

    const throwingStore = {
      append() {
        throw new Error("unavailable");
      },
      list() {
        return [];
      },
    };

    await expect(
      ingestAnalyticsEvent(
        { name: "page_view", path: "/" },
        { identity, store: throwingStore, limiter },
      ),
    ).resolves.toEqual({ accepted: false, reason: "store_error" });
  });

  it("rate limits repeated events from the same visitor", async () => {
    const store = new MemoryAnalyticsStore();
    const limiter = new MemoryRateLimiter(2, 60_000);
    const now = new Date("2024-03-01T00:00:00.000Z");

    await ingestAnalyticsEvent(
      { name: "page_view", path: "/" },
      { identity, store, limiter, now },
    );
    await ingestAnalyticsEvent(
      { name: "page_view", path: "/about" },
      { identity, store, limiter, now },
    );
    const limited = await ingestAnalyticsEvent(
      { name: "page_view", path: "/blog" },
      { identity, store, limiter, now },
    );

    expect(limited).toEqual({ accepted: false, reason: "rate_limited" });
    expect(store.list()).toHaveLength(2);
  });
});

describe("tracking behavior", () => {
  it("emits typed payloads through the centralized client", () => {
    const trackMock = jest.fn();
    setAnalyticsClient({ track: trackMock });

    trackPageView("/resume");
    trackProjectView("sample-app");
    trackBlogView("public-note");
    trackResumeEvent(analyticsEvents.resumeDownload, "general");
    trackContactSubmit("unavailable");

    expect(trackMock).toHaveBeenCalledWith({
      name: "page_view",
      path: "/resume",
    });
    expect(trackMock).toHaveBeenCalledWith({
      name: "project_view",
      path: "/projects/sample-app",
      projectSlug: "sample-app",
    });
    expect(trackMock).toHaveBeenCalledWith({
      name: "blog_view",
      path: "/blog/public-note",
      blogSlug: "public-note",
    });
    expect(trackMock.mock.calls.length).toBe(5);
  });

  it("swallows transport failures", async () => {
    setAnalyticsClient(null);
    const fetchMock = jest.fn(() => Promise.reject(new Error("offline")));
    global.fetch = fetchMock as unknown as typeof fetch;

    expect(() => track({ name: "page_view", path: "/" })).not.toThrow();
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalled();
  });

  it("maps only known outbound CTAs", () => {
    expect(outboundAnalyticsEvent("https://github.com/example/app")).toBe(
      "github_click",
    );
    expect(outboundAnalyticsEvent("https://www.linkedin.com/in/example")).toBe(
      "linkedin_click",
    );
    expect(outboundAnalyticsEvent("mailto:ada@example.com")).toBe(
      "email_click",
    );
    expect(outboundAnalyticsEvent("https://example.com/demo")).toBeNull();
  });
});

describe("anonymous identity cookies", () => {
  it("issues opaque session and visitor tokens", () => {
    const values = new Map<string, string>();
    const jar = {
      get(name: string) {
        const value = values.get(name);
        return value ? { value } : undefined;
      },
      set(name: string, value: string) {
        values.set(name, value);
      },
    };

    const first = resolveAnalyticsIdentity(jar);
    const second = resolveAnalyticsIdentity(jar);

    expect(first.sessionId).toBe(second.sessionId);
    expect(first.visitorId).toBe(second.visitorId);
    expect(values.get(analyticsCookieNames.session)).toBe(first.sessionId);
    expect(JSON.stringify(first)).not.toContain("@");
  });
});

describe("project popularity", () => {
  it("counts project_view records and stays replaceable", () => {
    const store = new MemoryAnalyticsStore();
    store.append({
      name: "project_view",
      path: "/projects/delta",
      projectSlug: "delta",
      timestamp: "2024-01-01T00:00:00.000Z",
      sessionId: identity.sessionId,
      visitorId: identity.visitorId,
    });
    store.append({
      name: "page_view",
      path: "/",
      timestamp: "2024-01-01T00:00:00.000Z",
      sessionId: identity.sessionId,
      visitorId: identity.visitorId,
    });

    expect(countProjectViews(store.list())).toEqual({ delta: 1 });
    expect(
      mergeProjectViewCounts({ alpha: 2 }, { delta: 1, alpha: 1 }),
    ).toEqual({ alpha: 3, delta: 1 });

    setAnalyticsStore(store);
    expect(getProjectViewCounts().delta).toBe(1);

    setProjectPopularitySource({
      id: "test",
      getViewCounts() {
        return { beta: 9 };
      },
    });
    expect(getProjectViewCounts()).toEqual({ beta: 9 });
  });
});
