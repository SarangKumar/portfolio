import { createHmac, timingSafeEqual } from "node:crypto";

// Signed, expiring cookie that marks an unlocked admin session. Runs in both
// the proxy (Node runtime) and server components, so it stays free of
// server-only imports.
export const ADMIN_SESSION_COOKIE = "pf_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

export function adminSessionCookieOptions(maxAge = ADMIN_SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge,
  };
}

function sign(expiresAt: number, secret: string): string {
  return createHmac("sha256", secret)
    .update(`admin-session:${expiresAt}`)
    .digest("hex");
}

export function signAdminSession(expiresAt: number, secret: string): string {
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

export function verifyAdminSession(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): boolean {
  if (!token || !secret) {
    return false;
  }

  const [expiresRaw, signature, extra] = token.split(".");

  if (!expiresRaw || !signature || extra !== undefined) {
    return false;
  }

  const expiresAt = Number(expiresRaw);

  if (!Number.isInteger(expiresAt) || expiresAt <= now) {
    return false;
  }

  const left = Buffer.from(signature, "hex");
  const right = Buffer.from(sign(expiresAt, secret), "hex");

  return left.length === right.length && timingSafeEqual(left, right);
}
