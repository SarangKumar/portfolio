import "server-only";

import { redirect } from "next/navigation";
import { resolveCurrentAdminAccess } from "@/admin/access";
import { authorizeAdminMutation } from "@/cms/authorize";

export async function requireAdminMutation() {
  const access = await resolveCurrentAdminAccess();

  if (access.status === "unauthenticated") {
    redirect("/login");
  }

  return authorizeAdminMutation(access);
}
