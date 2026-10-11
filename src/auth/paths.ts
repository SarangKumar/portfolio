const LOCALE_PREFIX = /^\/[a-z]{2}(?=\/|$)/i;

export const UNLOCK_PATH = "/unlock";

export function pathnameWithoutLocale(pathname: string): string {
  const stripped = pathname.replace(LOCALE_PREFIX, "");
  return stripped === "" ? "/" : stripped;
}

export function isPrivatePath(pathname: string): boolean {
  const path = pathnameWithoutLocale(pathname);
  return path === "/admin" || path.startsWith("/admin/");
}

export function unlockRedirectPath(pathname: string): string {
  const params = new URLSearchParams({ callbackUrl: pathname });
  return `${UNLOCK_PATH}?${params.toString()}`;
}
