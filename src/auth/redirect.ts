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

  if (
    value.startsWith("/login") ||
    value.startsWith("/signup") ||
    value.startsWith("/api/")
  ) {
    return PRIVATE_HOME;
  }

  return value;
}

export const postLogoutPath = "/";
