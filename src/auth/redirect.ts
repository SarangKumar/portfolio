import { UNLOCK_PATH } from "@/auth/paths";

const PRIVATE_HOME = "/admin";

export function safeInternalPath(value: string | undefined): string {
  if (!value) {
    return PRIVATE_HOME;
  }

  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("://")
  ) {
    return PRIVATE_HOME;
  }

  if (value.startsWith(UNLOCK_PATH) || value.startsWith("/api/")) {
    return PRIVATE_HOME;
  }

  return value;
}

export const postLogoutPath = "/";
