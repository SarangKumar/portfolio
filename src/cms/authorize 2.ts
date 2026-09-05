import type { Admin } from "@/admin/model";
import type { AdminAccess } from "@/admin/authorize";

export type AdminMutationAuth =
  { ok: true; admin: Admin } | { ok: false; code: "unauthorized" };

export function authorizeAdminMutation(access: AdminAccess): AdminMutationAuth {
  if (access.status !== "allowed") {
    return { ok: false, code: "unauthorized" };
  }

  return { ok: true, admin: access.admin };
}
