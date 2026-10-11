import type { Admin } from "@/admin/model";

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

export function executeAuthorizedAdminOperation<T>(
  access: AdminAccess,
  operation: (admin: Admin) => T,
): { ok: true; value: T } | { ok: false } {
  if (access.status !== "allowed") {
    return { ok: false };
  }

  return { ok: true, value: operation(access.admin) };
}
