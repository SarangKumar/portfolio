import { cookies } from "next/headers";
import { hashRateLimitIp, MemoryRateLimiter } from "@/analytics/rate-limit";
import { getAnalyticsStore } from "@/analytics/store";
import {
  analyticsVaultCookieName,
  analyticsVaultCookieOptions,
  ANALYTICS_VAULT_MAX_AGE,
  passwordsMatch,
  signVaultSession,
  verifyVaultSession,
  vaultSigningSecret,
} from "@/analytics/vault-session";
import {
  analyticsJsonPayload,
  formatAnalyticsSummary,
} from "@/analytics/vault-view";
import { serverEnv } from "@/lib/env/server";

export const dynamic = "force-dynamic";

const vaultUnlockLimiter = new MemoryRateLimiter(8, 15 * 60_000);
const emptyPassword = "";

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function requestIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || undefined;
  }

  return request.headers.get("x-real-ip")?.trim() || undefined;
}

function vaultSecret() {
  return vaultSigningSecret(
    serverEnv.analyticsVaultPassword,
    serverEnv.analyticsHashSalt,
  );
}

async function isUnlocked() {
  if (!serverEnv.analyticsVaultPassword) {
    return false;
  }

  const jar = await cookies();
  return verifyVaultSession(
    jar.get(analyticsVaultCookieName)?.value,
    vaultSecret(),
  );
}

export async function GET(request: Request) {
  const configured = Boolean(serverEnv.analyticsVaultPassword);
  const unlocked = await isUnlocked();
  const view = new URL(request.url).searchParams.get("view");

  if (!view) {
    return json({ configured, unlocked });
  }

  if (!configured) {
    return json({ ok: false, error: "unconfigured" }, 404);
  }

  if (!unlocked) {
    return json({ ok: false, error: "locked" }, 401);
  }

  const records = getAnalyticsStore().list();

  if (view === "json") {
    return json({
      ok: true,
      lines: [JSON.stringify(analyticsJsonPayload(records), null, 2)],
    });
  }

  if (view === "summary") {
    return json({
      ok: true,
      lines: formatAnalyticsSummary(records),
    });
  }

  return json({ ok: false, error: "locked" }, 400);
}

export async function POST(request: Request) {
  if (!serverEnv.analyticsVaultPassword) {
    return json({ ok: false, error: "unconfigured" }, 404);
  }

  const ip = requestIp(request);
  const ipHash = hashRateLimitIp(ip ?? "unknown", serverEnv.analyticsHashSalt);

  if (!vaultUnlockLimiter.consume(`vault:${ipHash}`).allowed) {
    return json({ ok: false, error: "rate_limited" }, 429);
  }

  let password = emptyPassword;

  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  if (password.length > 128) {
    return json({ ok: false, error: "invalid" }, 400);
  }

  if (!passwordsMatch(password, serverEnv.analyticsVaultPassword)) {
    return json({ ok: false, error: "invalid" }, 401);
  }

  const expiresAt = Date.now() + ANALYTICS_VAULT_MAX_AGE * 1000;
  const jar = await cookies();
  jar.set(
    analyticsVaultCookieName,
    signVaultSession(expiresAt, vaultSecret()),
    analyticsVaultCookieOptions(),
  );

  return json({ ok: true, unlocked: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.set(analyticsVaultCookieName, "", analyticsVaultCookieOptions(0));
  return json({ ok: true, unlocked: false });
}
