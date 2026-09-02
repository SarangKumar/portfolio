export const analyticsEvents = {
  projectView: "project_view",
  articleView: "article_view",
  resumeView: "resume_view",
  resumePreview: "resume_preview",
  resumeDownload: "resume_download",
  contactSubmit: "contact_submit",
} as const;

export type ProjectViewEvent = {
  name: typeof analyticsEvents.projectView;
  projectSlug: string;
};

export type ArticleViewEvent = {
  name: typeof analyticsEvents.articleView;
  articleSlug: string;
};

export type ResumeAnalyticsEvent = {
  name:
    | typeof analyticsEvents.resumeView
    | typeof analyticsEvents.resumePreview
    | typeof analyticsEvents.resumeDownload;
  resumeId: string;
};

export type ContactSubmitEvent = {
  name: typeof analyticsEvents.contactSubmit;
  result: "success" | "error" | "unavailable" | "ignored";
};

export type AnalyticsEvent =
  | ProjectViewEvent
  | ArticleViewEvent
  | ResumeAnalyticsEvent
  | ContactSubmitEvent;

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

export function trackArticleView(articleSlug: string) {
  getAnalyticsClient().track({
    name: analyticsEvents.articleView,
    articleSlug,
  });
}

export function trackResumeEvent(
  name: ResumeAnalyticsEvent["name"],
  resumeId: string,
) {
  getAnalyticsClient().track({ name, resumeId });
}

export function trackContactSubmit(result: ContactSubmitEvent["result"]) {
  getAnalyticsClient().track({
    name: analyticsEvents.contactSubmit,
    result,
  });
}
