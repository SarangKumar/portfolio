import type { AnalyticsRecord } from "@/analytics/schema";
import {
  ANALYTICS_VAULT_JSON_LIMIT,
  ANALYTICS_VAULT_RECENT_LIMIT,
} from "@/analytics/vault-session";

export function countEventsByName(
  records: readonly AnalyticsRecord[],
): readonly { name: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const record of records) {
    counts.set(record.name, (counts.get(record.name) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function formatAnalyticsSummary(
  records: readonly AnalyticsRecord[],
): readonly string[] {
  const counts = countEventsByName(records);
  const recent = records.slice(-ANALYTICS_VAULT_RECENT_LIMIT);
  const lines = [
    "analytics/",
    `events: ${records.length}`,
    ...counts.map(
      (entry) =>
        `  ${entry.name.padEnd(20, " ")} ${String(entry.count).padStart(4, " ")}`,
    ),
  ];

  if (records.length === 0) {
    lines.push("recent: none");
    return lines;
  }

  lines.push("", `recent (${recent.length}):`);

  for (const record of recent) {
    const target = record.projectSlug ?? record.blogSlug ?? record.path;
    lines.push(`  ${record.timestamp}  ${record.name}  ${target}`);
  }

  if (records.length > ANALYTICS_VAULT_RECENT_LIMIT) {
    lines.push(`  … ${records.length - ANALYTICS_VAULT_RECENT_LIMIT} older`);
  }

  return lines;
}

export function analyticsJsonPayload(records: readonly AnalyticsRecord[]) {
  const slice = records.slice(-ANALYTICS_VAULT_JSON_LIMIT);

  return {
    count: records.length,
    shown: slice.length,
    truncated: records.length > slice.length,
    events: slice,
  };
}
