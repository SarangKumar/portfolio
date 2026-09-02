import { describe, expect, it, jest } from "@jest/globals";
import {
  analyticsEvents,
  noopAnalytics,
  setAnalyticsClient,
  trackProjectView,
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
