"use server";

import { unstable_rethrow } from "next/navigation";
import { requireAdmin } from "@/admin/access";
import { AdminAuthorizationError } from "@/admin/authorize";

export type AdminOperationResult = { ok: true } | { ok: false };

export async function readAuthorizedAdminContext(): Promise<AdminOperationResult> {
  try {
    await requireAdmin();
    return { ok: true };
  } catch (error) {
    unstable_rethrow(error);

    if (error instanceof AdminAuthorizationError) {
      return { ok: false };
    }

    throw error;
  }
}
