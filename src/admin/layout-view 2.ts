import type { AdminAccess } from "@/admin/authorize";

export type AdminLayoutView = "login" | "denied" | "shell";

export function adminLayoutView(access: AdminAccess): AdminLayoutView {
  if (access.status === "unauthenticated") {
    return "login";
  }

  if (access.status === "denied") {
    return "denied";
  }

  return "shell";
}
