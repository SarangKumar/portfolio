/**
 * Public view counts keyed by project slug.
 * Populated later from analytics; empty until then.
 */
export const projectViewCounts: Readonly<Record<string, number>> = {};
