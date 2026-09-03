import "server-only";

import { redirect } from "next/navigation";
import {
  AdminAuthorizationError,
  resolveAdminAccess,
  type AdminAccess,
} from "@/admin/authorize";
import { buildAdminDirectory } from "@/admin/directory";
import type { Admin } from "@/admin/model";
import { getCurrentUser } from "@/auth/session";
import { serverEnv } from "@/lib/env/server";

export function loadAdminDirectory() {
  return buildAdminDirectory({
    bootstrapEmail: serverEnv.adminEmail,
    emails: serverEnv.adminEmails,
    inactiveEmails: serverEnv.adminInactiveEmails,
  });
}

export async function resolveCurrentAdminAccess(): Promise<AdminAccess> {
  const user = await getCurrentUser();
  return resolveAdminAccess(user, loadAdminDirectory());
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
    redirect("/login");
  }

  if (access.status !== "allowed") {
    throw new AdminAuthorizationError();
  }

  return access.admin;
}
