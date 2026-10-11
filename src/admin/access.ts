import "server-only";

import { redirect } from "next/navigation";
import { AdminAuthorizationError, type AdminAccess } from "@/admin/authorize";
import { createAdminRecord } from "@/admin/record";
import type { Admin } from "@/admin/model";
import { hasAdminSession } from "@/auth/admin-gate";
import { UNLOCK_PATH } from "@/auth/paths";
import { serverEnv } from "@/lib/env/server";

/**
 * There is one admin: whoever holds the unlocked session cookie. The record
 * carries the owner identity so existing rows keep their owner.
 */
function ownerAdmin(): Admin {
  return createAdminRecord(serverEnv.adminEmail || "owner", "active");
}

export async function resolveCurrentAdminAccess(): Promise<AdminAccess> {
  if (!(await hasAdminSession())) {
    return { status: "unauthenticated" };
  }

  return { status: "allowed", admin: ownerAdmin() };
}

export async function getCurrentAdmin(): Promise<Admin | null> {
  const access = await resolveCurrentAdminAccess();
  return access.status === "allowed" ? access.admin : null;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const access = await resolveCurrentAdminAccess();
  return access.status === "allowed";
}

export async function requireAdmin(): Promise<Admin> {
  const access = await resolveCurrentAdminAccess();

  if (access.status === "unauthenticated") {
    redirect(UNLOCK_PATH);
  }

  if (access.status !== "allowed") {
    throw new AdminAuthorizationError();
  }

  return access.admin;
}
