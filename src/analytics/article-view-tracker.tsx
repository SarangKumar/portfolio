"use client";

import { useEffect } from "react";
import { trackArticleView } from "@/analytics/events";

type ArticleViewTrackerProps = {
  slug: string;
};

export function ArticleViewTracker({ slug }: ArticleViewTrackerProps) {
  useEffect(() => {
    trackArticleView(slug);
  }, [slug]);

  return null;
}
