import { createHash } from "node:crypto";

export type RateLimitDecision = {
  allowed: boolean;
};

type RateBucket = {
  count: number;
  resetAt: number;
};

export class MemoryRateLimiter {
  private readonly buckets = new Map<string, RateBucket>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  consume(key: string, now = Date.now()): RateLimitDecision {
    this.prune(now);

    const current = this.buckets.get(key);

    if (!current || current.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
      return { allowed: true };
    }

    if (current.count >= this.limit) {
      return { allowed: false };
    }

    current.count += 1;
    return { allowed: true };
  }

  reset() {
    this.buckets.clear();
  }

  private prune(now: number) {
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }
}

export const analyticsRateLimiter = new MemoryRateLimiter(40, 60_000);

export function hashRateLimitIp(
  ip: string,
  salt: string,
  now = Date.now(),
): string {
  const hourBucket = Math.floor(now / 3_600_000);
  return createHash("sha256")
    .update(`${salt}:${hourBucket}:${ip}`)
    .digest("hex")
    .slice(0, 24);
}

export function analyticsRateLimitKey(input: {
  visitorId?: string;
  ipHash?: string;
}): string {
  if (input.visitorId) {
    return `visitor:${input.visitorId}`;
  }

  if (input.ipHash) {
    return `iphash:${input.ipHash}`;
  }

  return "anonymous";
}
