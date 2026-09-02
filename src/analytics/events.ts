export const analyticsEvents = {
  projectView: "project_view",
} as const;

export type ProjectViewEvent = {
  name: typeof analyticsEvents.projectView;
  projectSlug: string;
};

export type AnalyticsEvent = ProjectViewEvent;

export type AnalyticsClient = {
  track: (event: AnalyticsEvent) => void;
};

export const noopAnalytics: AnalyticsClient = {
  track() {},
};

let analyticsClient: AnalyticsClient = noopAnalytics;

export function getAnalyticsClient(): AnalyticsClient {
  return analyticsClient;
}

export function setAnalyticsClient(client: AnalyticsClient) {
  analyticsClient = client;
}

export function trackProjectView(projectSlug: string) {
  getAnalyticsClient().track({
    name: analyticsEvents.projectView,
    projectSlug,
  });
}
