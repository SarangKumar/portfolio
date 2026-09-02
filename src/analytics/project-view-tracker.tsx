"use client";

import { useEffect } from "react";
import { trackProjectView } from "@/analytics/events";

type ProjectViewTrackerProps = {
  slug: string;
};

export function ProjectViewTracker({ slug }: ProjectViewTrackerProps) {
  useEffect(() => {
    trackProjectView(slug);
  }, [slug]);

  return null;
}
