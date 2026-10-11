import "server-only";

import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  adminSessionCookieOptions,
  signAdminSession,
  verifyAdminSession,
} from "@/auth/admin-session";
import { normalizeEmail, stableIdentityId } from "@/auth/identity";
import { serverEnv } from "@/lib/env/server";

/**
 * Stable id stored on records the admin creates (job applications, project
 * history). It is derived from ADMIN_EMAIL, the same way it was when sign-in
 * used email, so existing rows keep their owner. ADMIN_EMAIL is no longer used
 * to log in.
 */
export function ownerIdentityId(): string {
  return stableIdentityId(normalizeEmail(serverEnv.adminEmail || "owner"));
}

export async function hasAdminSession(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminSession(
    jar.get(ADMIN_SESSION_COOKIE)?.value,
    serverEnv.authSecret,
  );
}

export async function startAdminSession(): Promise<void> {
  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
  const jar = await cookies();

  jar.set(
    ADMIN_SESSION_COOKIE,
    signAdminSession(expiresAt, serverEnv.authSecret),
    adminSessionCookieOptions(),
  );
}

export async function endAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete({ name: ADMIN_SESSION_COOKIE, path: "/" });
}

/** False when either the hash or the signing secret is missing. */
export async function checkAdminPassword(password: string): Promise<boolean> {
  const hash = serverEnv.adminPasswordHash;

  if (!hash || !serverEnv.authSecret || !password) {
    return false;
  }

  return compare(password, hash);
}
