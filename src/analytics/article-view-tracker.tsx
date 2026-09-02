"use client";

import { useEffect } from "react";
import { trackBlogView } from "@/analytics/events";

type ArticleViewTrackerProps = {
  slug: string;
};

export function ArticleViewTracker({ slug }: ArticleViewTrackerProps) {
  useEffect(() => {
    trackBlogView(slug);
  }, [slug]);

  return null;
}
