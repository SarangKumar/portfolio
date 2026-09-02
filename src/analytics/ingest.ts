import type { AnalyticsIdentity } from "@/analytics/identity";
import {
  createAnalyticsRecord,
  validateAnalyticsPayload,
} from "@/analytics/schema";
import {
  analyticsRateLimitKey,
  analyticsRateLimiter,
  type MemoryRateLimiter,
} from "@/analytics/rate-limit";
import { getAnalyticsStore, type AnalyticsStore } from "@/analytics/store";

export type { AnalyticsIdentity };

export type AnalyticsIngestResult = {
  accepted: boolean;
  reason?: "invalid" | "rate_limited" | "store_error";
};

export type AnalyticsIngestOptions = {
  identity: AnalyticsIdentity;
  store?: AnalyticsStore;
  limiter?: MemoryRateLimiter;
  now?: Date;
  rateLimitKey?: string;
};

export async function ingestAnalyticsEvent(
  input: unknown,
  options: AnalyticsIngestOptions,
): Promise<AnalyticsIngestResult> {
  const validation = validateAnalyticsPayload(input);

  if (!validation.ok) {
    return { accepted: false, reason: "invalid" };
  }

  const limiter = options.limiter ?? analyticsRateLimiter;
  const key =
    options.rateLimitKey ??
    analyticsRateLimitKey({ visitorId: options.identity.visitorId });

  if (!limiter.consume(key, options.now?.getTime()).allowed) {
    return { accepted: false, reason: "rate_limited" };
  }

  const record = createAnalyticsRecord(validation.value, {
    timestamp: (options.now ?? new Date()).toISOString(),
    sessionId: options.identity.sessionId,
    visitorId: options.identity.visitorId,
  });

  try {
    await (options.store ?? getAnalyticsStore()).append(record);
    return { accepted: true };
  } catch {
    return { accepted: false, reason: "store_error" };
  }
}
