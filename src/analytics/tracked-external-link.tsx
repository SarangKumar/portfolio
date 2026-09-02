"use client";

import type { ComponentProps } from "react";
import {
  outboundAnalyticsEvent,
  track,
  analyticsEvents,
} from "@/analytics/events";

type TrackedExternalLinkProps = ComponentProps<"a"> & {
  href: string;
};

export function TrackedExternalLink({
  href,
  onClick,
  ...props
}: TrackedExternalLinkProps) {
  const eventName = outboundAnalyticsEvent(href);

  return (
    <a
      href={href}
      onClick={(event) => {
        if (eventName) {
          const host = href.startsWith("mailto:")
            ? undefined
            : (() => {
                try {
                  return new URL(href).hostname.toLowerCase();
                } catch {
                  return undefined;
                }
              })();

          track({
            name: eventName,
            path:
              typeof window === "undefined"
                ? "/"
                : window.location.pathname || "/",
            metadata:
              eventName === analyticsEvents.emailClick
                ? undefined
                : host
                  ? { host }
                  : undefined,
          });
        }

        onClick?.(event);
      }}
      {...props}
    />
  );
}
