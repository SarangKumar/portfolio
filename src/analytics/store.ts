import type { AnalyticsRecord } from "@/analytics/schema";
import { analyticsEvents } from "@/analytics/schema";

export type AnalyticsStore = {
  append(record: AnalyticsRecord): Promise<void> | void;
  list(): readonly AnalyticsRecord[];
};

const DEFAULT_LIMIT = 10_000;

export class MemoryAnalyticsStore implements AnalyticsStore {
  private records: AnalyticsRecord[] = [];

  constructor(private readonly limit = DEFAULT_LIMIT) {}

  append(record: AnalyticsRecord) {
    this.records.push(record);

    if (this.records.length > this.limit) {
      this.records = this.records.slice(-this.limit);
    }
  }

  list(): readonly AnalyticsRecord[] {
    return this.records;
  }

  clear() {
    this.records = [];
  }
}

const defaultStore = new MemoryAnalyticsStore();

let activeStore: AnalyticsStore = defaultStore;

export function getAnalyticsStore(): AnalyticsStore {
  return activeStore;
}

export function setAnalyticsStore(store: AnalyticsStore) {
  activeStore = store;
}

export function resetAnalyticsStore() {
  defaultStore.clear();
  activeStore = defaultStore;
}

export function countProjectViews(
  records: readonly AnalyticsRecord[],
): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};

  for (const record of records) {
    if (record.name !== analyticsEvents.projectView || !record.projectSlug) {
      continue;
    }

    counts[record.projectSlug] = (counts[record.projectSlug] ?? 0) + 1;
  }

  return counts;
}
