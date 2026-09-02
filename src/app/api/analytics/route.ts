import { hashRateLimitIp } from "@/analytics/rate-limit";
import { ingestFromRequestContext } from "@/analytics/request-context";
import { ANALYTICS_MAX_BODY_BYTES } from "@/analytics/schema";
import { serverEnv } from "@/lib/env/server";

const empty = new Response(null, { status: 204 });

function requestIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || undefined;
  }

  return request.headers.get("x-real-ip")?.trim() || undefined;
}

export async function POST(request: Request) {
  try {
    const lengthHeader = request.headers.get("content-length");
    const length = lengthHeader ? Number(lengthHeader) : undefined;

    if (length !== undefined && length > ANALYTICS_MAX_BODY_BYTES) {
      return empty;
    }

    const body = await request.text();

    if (body.length > ANALYTICS_MAX_BODY_BYTES) {
      return empty;
    }

    const payload = JSON.parse(body) as unknown;
    const ip = requestIp(request);
    const ipHash = ip
      ? hashRateLimitIp(ip, serverEnv.analyticsHashSalt)
      : undefined;

    await ingestFromRequestContext(payload, { ipHash });
  } catch {
    // Drop malformed or unavailable analytics silently.
  }

  return empty;
}
