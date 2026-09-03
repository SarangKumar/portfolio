import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { compare } from "bcryptjs";
import { stableIdentityId, normalizeEmail } from "@/auth/identity";
import type { AuthUser } from "@/auth/user";
import { serverEnv } from "@/lib/env/server";

export type AdminCredentialConfig = {
  email: string;
  passwordHash: string;
};

/**
 * Valid bcrypt hash used only so a password comparison still runs when the
 * identifier does not match. It is not a real account password.
 */
const TIMING_DUMMY_HASH =
  "$2b$10$Fb5EK2G1km2PA9WFG8cX9.14X0UBhTyfdv2eSOA59WDTYPRMg7ZQu";

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function emailsMatch(left: string, right: string): boolean {
  return timingSafeEqual(digest(left), digest(right));
}

export function adminCredentialConfigFromEnv(): AdminCredentialConfig {
  return {
    email: normalizeEmail(serverEnv.adminEmail),
    passwordHash: serverEnv.adminPasswordHash,
  };
}

export async function verifyAdminCredentials(
  input: { email: string; password: string },
  config: AdminCredentialConfig = adminCredentialConfigFromEnv(),
): Promise<AuthUser | null> {
  const email = normalizeEmail(input.email);
  const password = input.password;
  const configured = Boolean(config.email && config.passwordHash);
  const identifierMatches = configured && emailsMatch(email, config.email);
  const hash = identifierMatches ? config.passwordHash : TIMING_DUMMY_HASH;
  const passwordMatches = await compare(password || " ", hash);

  if (!configured || !identifierMatches || !passwordMatches) {
    return null;
  }

  return {
    id: stableIdentityId(config.email),
    email: config.email,
  };
}
