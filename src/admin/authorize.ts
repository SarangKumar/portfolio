import { normalizeEmail } from "@/auth/identity";
import type { Admin } from "@/admin/model";
import type { AuthUser } from "@/auth/user";

export type AdminAccess =
  | { status: "unauthenticated" }
  | { status: "denied" }
  | { status: "allowed"; admin: Admin };

export class AdminAuthorizationError extends Error {
  constructor() {
    super("Access denied");
    this.name = "AdminAuthorizationError";
  }
}

export function findAdminByEmail(
  email: string,
  directory: readonly Admin[],
): Admin | null {
  const normalized = normalizeEmail(email);
  return directory.find((admin) => admin.email === normalized) ?? null;
}

export function resolveAdminAccess(
  user: AuthUser | null,
  directory: readonly Admin[],
): AdminAccess {
  if (!user) {
    return { status: "unauthenticated" };
  }

  const admin = findAdminByEmail(user.email, directory);

  if (!admin || admin.status !== "active") {
    return { status: "denied" };
  }

  return { status: "allowed", admin };
}

export function isAdmin(
  user: AuthUser | null,
  directory: readonly Admin[],
): boolean {
  return resolveAdminAccess(user, directory).status === "allowed";
}

export function executeAuthorizedAdminOperation<T>(
  access: AdminAccess,
  operation: (admin: Admin) => T,
): { ok: true; value: T } | { ok: false } {
  if (access.status !== "allowed") {
    return { ok: false };
  }

  return { ok: true, value: operation(access.admin) };
}
