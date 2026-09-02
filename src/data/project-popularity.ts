/**
 * Public view counts keyed by project slug.
 * Snapshot of published view counts. Live ranking prefers the analytics
 * store and can be swapped via `setProjectPopularitySource`.
 */
export const projectViewCounts: Readonly<Record<string, number>> = {};
