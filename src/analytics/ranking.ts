export const FEATURED_PROJECT_LIMIT = 3;

export type RankedProject<T extends { slug: string } = { slug: string }> = {
  item: T;
  viewCount: number;
  source: "analytics" | "fallback";
};

export function rankProjectsByPopularity<T extends { slug: string }>(
  items: readonly T[],
  viewCounts: Readonly<Record<string, number>> = {},
  limit = FEATURED_PROJECT_LIMIT,
): readonly RankedProject<T>[] {
  if (items.length === 0 || limit <= 0) {
    return [];
  }

  const indexed = items.map((item, index) => ({
    item,
    index,
    viewCount: Math.max(0, viewCounts[item.slug] ?? 0),
  }));

  const withViews = indexed
    .filter((entry) => entry.viewCount > 0)
    .sort((a, b) => b.viewCount - a.viewCount || a.index - b.index);
  const fallback = indexed
    .filter((entry) => entry.viewCount === 0)
    .sort((a, b) => a.index - b.index);

  return [...withViews, ...fallback].slice(0, limit).map((entry) => ({
    item: entry.item,
    viewCount: entry.viewCount,
    source: entry.viewCount > 0 ? "analytics" : "fallback",
  }));
}

export function featuredProjectItems<T extends { slug: string }>(
  items: readonly T[],
  viewCounts: Readonly<Record<string, number>> = {},
  limit = FEATURED_PROJECT_LIMIT,
): readonly T[] {
  return rankProjectsByPopularity(items, viewCounts, limit).map(
    (entry) => entry.item,
  );
}

export function popularityChartPoints(
  ranking: readonly RankedProject<{ slug: string; title?: string }>[],
): readonly { label: string; value: number }[] {
  return ranking
    .filter((entry) => entry.viewCount > 0)
    .map((entry) => ({
      label: entry.item.title ?? entry.item.slug,
      value: entry.viewCount,
    }));
}
