const LOCALE_PREFIX = /^\/[a-z]{2}(?=\/|$)/i;

export function pathnameWithoutLocale(pathname: string): string {
  const stripped = pathname.replace(LOCALE_PREFIX, "");
  return stripped === "" ? "/" : stripped;
}

export function isPrivatePath(pathname: string): boolean {
  const path = pathnameWithoutLocale(pathname);
  return path === "/admin" || path.startsWith("/admin/");
}

export function isLoginPath(pathname: string): boolean {
  return pathnameWithoutLocale(pathname) === "/login";
}

export function shouldRedirectToLogin(
  pathname: string,
  isAuthenticated: boolean,
): boolean {
  return isPrivatePath(pathname) && !isAuthenticated;
}

export function loginRedirectPath(pathname: string): string {
  const params = new URLSearchParams({ callbackUrl: pathname });
  return `/login?${params.toString()}`;
}
