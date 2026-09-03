import "server-only";

import { auth } from "@/auth";
import { requireUserOrRedirect } from "@/auth/guard";
import { toAuthUser, type AuthUser } from "@/auth/user";
import { serverEnv } from "@/lib/env/server";

export async function getSession() {
  if (!serverEnv.authSecret) {
    return null;
  }

  return auth();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  return toAuthUser(session);
}

export async function requireAuthentication(): Promise<AuthUser> {
  return requireUserOrRedirect(await getCurrentUser());
}
