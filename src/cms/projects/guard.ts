import "server-only";

import { redirect } from "next/navigation";
import { resolveCurrentAdminAccess } from "@/admin/access";
import { authorizeAdminMutation } from "@/cms/authorize";
import { UNLOCK_PATH } from "@/auth/paths";

export async function requireAdminMutation() {
  const access = await resolveCurrentAdminAccess();

  if (access.status === "unauthenticated") {
    redirect(UNLOCK_PATH);
  }

  return authorizeAdminMutation(access);
}
