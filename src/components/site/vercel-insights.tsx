"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/** Drop admin pages from analytics; everything else is sent unchanged. */
function dropAdmin<T extends { url: string }>(event: T): T | null {
  try {
    return new URL(event.url).pathname.startsWith("/admin") ? null : event;
  } catch {
    return event;
  }
}

/**
 * Vercel Web Analytics + Speed Insights, mounted once in the root layout.
 * Both no-op locally (dev mode logs only) and only report on Vercel
 * deployments once enabled in the project dashboard.
 */
export function VercelInsights() {
  return (
    <>
      <Analytics beforeSend={(e: BeforeSendEvent) => dropAdmin(e)} />
      <SpeedInsights beforeSend={(e) => dropAdmin(e)} />
    </>
  );
}
