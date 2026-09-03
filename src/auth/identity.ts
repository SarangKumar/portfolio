import { createHash } from "node:crypto";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function stableIdentityId(email: string): string {
  return createHash("sha256")
    .update(`identity:${normalizeEmail(email)}`)
    .digest("hex")
    .slice(0, 24);
}
