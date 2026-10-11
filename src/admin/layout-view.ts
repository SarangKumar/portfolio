import type { AdminAccess } from "@/admin/authorize";

export type AdminLayoutView = "unlock" | "denied" | "shell";

export function adminLayoutView(access: AdminAccess): AdminLayoutView {
  if (access.status === "unauthenticated") {
    return "unlock";
  }

  if (access.status === "denied") {
    return "denied";
  }

  return "shell";
}
