import "server-only";

import { headers } from "next/headers";
import { hashRateLimitIp, MemoryRateLimiter } from "@/analytics/rate-limit";
import { serverEnv } from "@/lib/env/server";

export const loginRateLimiter = new MemoryRateLimiter(8, 15 * 60_000);

function loginRateLimitSalt(): string {
  return serverEnv.authSecret || serverEnv.analyticsHashSalt || "auth";
}

function requestIp(headerList: Headers): string {
  const forwarded = headerList.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return headerList.get("x-real-ip")?.trim() || "unknown";
}

export async function getLoginRateLimitKey(): Promise<string> {
  const headerList = await headers();
  return `login:${hashRateLimitIp(requestIp(headerList), loginRateLimitSalt())}`;
}
