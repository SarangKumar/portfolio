import {
  analyticsEvents,
  type AnalyticsClientPayload,
  type AnalyticsEventName,
  type ContactSubmitResult,
} from "@/analytics/schema";

export type AnalyticsClient = {
  track: (payload: AnalyticsClientPayload) => void;
};

export const noopAnalytics: AnalyticsClient = {
  track() {},
};

let analyticsClient: AnalyticsClient | null = null;

export function getAnalyticsClient(): AnalyticsClient | null {
  return analyticsClient;
}

export function setAnalyticsClient(client: AnalyticsClient | null) {
  analyticsClient = client;
}

function sendAnalytics(payload: AnalyticsClientPayload) {
  const body = JSON.stringify(payload);

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function track(payload: AnalyticsClientPayload) {
  try {
    if (analyticsClient) {
      analyticsClient.track(payload);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    sendAnalytics(payload);
  } catch {
    // Tracking must never throw into page code.
  }
}

function currentPath(fallback: string): string {
  if (typeof window === "undefined") {
    return fallback;
  }

  return window.location.pathname || fallback;
}

export function trackPageView(path: string) {
  track({ name: analyticsEvents.pageView, path });
}

export function trackProjectView(projectSlug: string) {
  track({
    name: analyticsEvents.projectView,
    path: `/projects/${projectSlug}`,
    projectSlug,
  });
}

export function trackBlogView(blogSlug: string) {
  track({
    name: analyticsEvents.blogView,
    path: `/blog/${blogSlug}`,
    blogSlug,
  });
}

export function trackResumeEvent(
  name:
    | typeof analyticsEvents.resumeView
    | typeof analyticsEvents.resumePreview
    | typeof analyticsEvents.resumeDownload,
  resumeId: string,
) {
  track({
    name,
    path: "/resume",
    metadata: { resumeId },
  });
}

export function trackGithubClick(path = currentPath("/")) {
  track({ name: analyticsEvents.githubClick, path });
}

export function trackLinkedinClick(path = currentPath("/")) {
  track({ name: analyticsEvents.linkedinClick, path });
}

export function trackEmailClick(path = currentPath("/contact")) {
  track({ name: analyticsEvents.emailClick, path });
}

export function trackTerminalOpen(path = currentPath("/")) {
  track({ name: analyticsEvents.terminalOpen, path });
}

export function trackTerminalCommand(command: string, path = currentPath("/")) {
  track({
    name: analyticsEvents.terminalCommand,
    path,
    metadata: { command },
  });
}

export function trackContactSubmit(result: ContactSubmitResult) {
  track({
    name: analyticsEvents.contactSubmit,
    path: "/contact",
    metadata: { result },
  });
}

export function outboundAnalyticsEvent(
  href: string,
): Extract<
  AnalyticsEventName,
  "github_click" | "linkedin_click" | "email_click"
> | null {
  if (/^mailto:/i.test(href)) {
    return analyticsEvents.emailClick;
  }

  try {
    const url = new URL(href);
    const host = url.hostname.toLowerCase();

    if (host === "github.com" || host.endsWith(".github.com")) {
      return analyticsEvents.githubClick;
    }

    if (host === "linkedin.com" || host.endsWith(".linkedin.com")) {
      return analyticsEvents.linkedinClick;
    }
  } catch {
    return null;
  }

  return null;
}

export { analyticsEvents };
export type { AnalyticsClientPayload, AnalyticsEventName, ContactSubmitResult };
