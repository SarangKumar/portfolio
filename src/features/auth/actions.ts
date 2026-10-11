"use server";

import { redirect } from "next/navigation";
import {
  checkAdminPassword,
  endAdminSession,
  startAdminSession,
} from "@/auth/admin-gate";
import { getLoginRateLimitKey, loginRateLimiter } from "@/auth/rate-limit";
import { postLogoutPath, safeInternalPath } from "@/auth/redirect";

export type UnlockFormState = {
  status: "idle" | "error" | "rateLimited";
};

const MAX_PASSWORD_LENGTH = 256;

export async function submitUnlock(
  _previous: UnlockFormState,
  formData: FormData,
): Promise<UnlockFormState> {
  const password = formData.get("password");
  const callbackUrl = formData.get("callbackUrl");

  if (
    typeof password !== "string" ||
    !password ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return { status: "error" };
  }

  if (!loginRateLimiter.consume(await getLoginRateLimitKey()).allowed) {
    return { status: "rateLimited" };
  }

  if (!(await checkAdminPassword(password))) {
    return { status: "error" };
  }

  await startAdminSession();
  redirect(
    safeInternalPath(typeof callbackUrl === "string" ? callbackUrl : ""),
  );
}

export async function lockAdminAction() {
  await endAdminSession();
  redirect(postLogoutPath);
}
