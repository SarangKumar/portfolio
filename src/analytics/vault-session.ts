import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const analyticsVaultCookieName = "pf_av";
export const ANALYTICS_VAULT_MAX_AGE = 60 * 30;
export const ANALYTICS_VAULT_JSON_LIMIT = 80;
export const ANALYTICS_VAULT_RECENT_LIMIT = 20;

export function analyticsVaultCookieOptions(maxAge = ANALYTICS_VAULT_MAX_AGE) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge,
  };
}

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function passwordsMatch(provided: string, expected: string): boolean {
  if (!expected || !provided) {
    return false;
  }

  const left = sha256(provided);
  const right = sha256(expected);

  return timingSafeEqual(left, right);
}

export function signVaultSession(expiresAt: number, secret: string): string {
  const hmac = createHmac("sha256", secret)
    .update(`vault:${expiresAt}`)
    .digest("hex");

  return `${expiresAt}.${hmac}`;
}

export function verifyVaultSession(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): boolean {
  if (!token || !secret) {
    return false;
  }

  const [expiresRaw, signature] = token.split(".");

  if (!expiresRaw || !signature) {
    return false;
  }

  const expiresAt = Number(expiresRaw);

  if (!Number.isFinite(expiresAt) || expiresAt <= now) {
    return false;
  }

  const expected = signVaultSession(expiresAt, secret);
  const left = Buffer.from(token);
  const right = Buffer.from(expected);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function vaultSigningSecret(password: string, salt: string): string {
  return `${password}:${salt || "vault"}`;
}
