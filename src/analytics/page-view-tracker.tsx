"use client";

import { useEffect } from "react";
import { trackPageView } from "@/analytics/events";
import { usePathname } from "@/i18n/navigation";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
