import { countProjectViews, getAnalyticsStore } from "@/analytics/store";
import { projectViewCounts as staticProjectViewCounts } from "@/data/project-popularity";

export type ProjectPopularitySource = {
  readonly id: string;
  getViewCounts(): Readonly<Record<string, number>>;
};

export function mergeProjectViewCounts(
  ...sources: readonly Readonly<Record<string, number>>[]
): Readonly<Record<string, number>> {
  const merged: Record<string, number> = {};

  for (const source of sources) {
    for (const [slug, count] of Object.entries(source)) {
      merged[slug] = (merged[slug] ?? 0) + count;
    }
  }

  return merged;
}

export function createStaticPopularitySource(
  counts: Readonly<Record<string, number>>,
): ProjectPopularitySource {
  return {
    id: "static",
    getViewCounts() {
      return counts;
    },
  };
}

export function createStorePopularitySource(): ProjectPopularitySource {
  return {
    id: "analytics-store",
    getViewCounts() {
      return countProjectViews(getAnalyticsStore().list());
    },
  };
}

const defaultPopularitySource: ProjectPopularitySource = {
  id: "static-and-store",
  getViewCounts() {
    return mergeProjectViewCounts(
      staticProjectViewCounts,
      countProjectViews(getAnalyticsStore().list()),
    );
  },
};

let popularitySource: ProjectPopularitySource = defaultPopularitySource;

export function setProjectPopularitySource(source: ProjectPopularitySource) {
  popularitySource = source;
}

export function resetProjectPopularitySource() {
  popularitySource = defaultPopularitySource;
}

export function getProjectPopularitySource(): ProjectPopularitySource {
  return popularitySource;
}

export function getProjectViewCounts(): Readonly<Record<string, number>> {
  return popularitySource.getViewCounts();
}
