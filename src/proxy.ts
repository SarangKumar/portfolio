import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "./auth/admin-session";
import {
  isPrivatePath,
  pathnameWithoutLocale,
  unlockRedirectPath,
  UNLOCK_PATH,
} from "./auth/paths";
import { safeInternalPath } from "./auth/redirect";
import { routing } from "./i18n/routing";

const handleI18n = createIntlMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname, origin, searchParams } = request.nextUrl;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const unlocked = verifyAdminSession(token, process.env.AUTH_SECRET ?? "");

  // Redirect here rather than in the page: a redirect from inside a streamed
  // page is sent as a 200, not a 307.
  if (unlocked && pathnameWithoutLocale(pathname) === UNLOCK_PATH) {
    const target = safeInternalPath(searchParams.get("callbackUrl") ?? "");
    return NextResponse.redirect(new URL(target, origin));
  }

  if (!isPrivatePath(pathname)) {
    return handleI18n(request);
  }

  if (unlocked) {
    return handleI18n(request);
  }

  return NextResponse.redirect(new URL(unlockRedirectPath(pathname), origin));
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
