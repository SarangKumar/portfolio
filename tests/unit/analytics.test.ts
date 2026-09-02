import { describe, expect, it, jest } from "@jest/globals";
import {
  analyticsEvents,
  noopAnalytics,
  setAnalyticsClient,
  trackArticleView,
  trackContactSubmit,
  trackProjectView,
  trackResumeEvent,
} from "@/analytics/events";

describe("project_view analytics", () => {
  it("emits a project_view event keyed by slug", () => {
    const track = jest.fn();
    setAnalyticsClient({ track });

    trackProjectView("sample-app");

    expect(track).toHaveBeenCalledWith({
      name: analyticsEvents.projectView,
      projectSlug: "sample-app",
    });
    expect(analyticsEvents.projectView).toBe("project_view");

    setAnalyticsClient(noopAnalytics);
  });
});

describe("public content analytics", () => {
  it("emits article, resume, and contact events without personal payloads", () => {
    const track = jest.fn();
    setAnalyticsClient({ track });

    trackArticleView("public-note");
    trackResumeEvent(analyticsEvents.resumeDownload, "general");
    trackContactSubmit("unavailable");

    expect(track).toHaveBeenCalledWith({
      name: analyticsEvents.articleView,
      articleSlug: "public-note",
    });
    expect(track).toHaveBeenCalledWith({
      name: analyticsEvents.resumeDownload,
      resumeId: "general",
    });
    expect(track).toHaveBeenCalledWith({
      name: analyticsEvents.contactSubmit,
      result: "unavailable",
    });
    expect(analyticsEvents.articleView).toBe("article_view");
    expect(analyticsEvents.resumePreview).toBe("resume_preview");

    setAnalyticsClient(noopAnalytics);
  });
});
