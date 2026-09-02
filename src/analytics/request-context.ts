import { cookies } from "next/headers";
import { ingestAnalyticsEvent } from "@/analytics/ingest";
import { resolveAnalyticsIdentity } from "@/analytics/identity";
import { analyticsRateLimitKey } from "@/analytics/rate-limit";

export async function ingestFromRequestContext(
  payload: unknown,
  extras?: { ipHash?: string },
): Promise<void> {
  try {
    const jar = await cookies();
    const identity = resolveAnalyticsIdentity(jar);
    await ingestAnalyticsEvent(payload, {
      identity,
      rateLimitKey: analyticsRateLimitKey({
        visitorId: identity.visitorId,
        ipHash: extras?.ipHash,
      }),
    });
  } catch {
    // Analytics must never fail the surrounding request.
  }
}
