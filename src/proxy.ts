import NextAuth from "next-auth";
import createIntlMiddleware from "next-intl/middleware";
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { authConfig } from "./auth/config";
import {
  isPrivatePath,
  loginRedirectPath,
  shouldRedirectToLogin,
} from "./auth/paths";
import { routing } from "./i18n/routing";

const { auth } = NextAuth(authConfig);
const handleI18n = createIntlMiddleware(routing);

type AuthProxy = (
  request: NextRequest,
  event: NextFetchEvent,
) => ReturnType<typeof handleI18n>;

const protectPrivateRoutes = auth((request) => {
  const isAuthenticated = Boolean(request.auth?.user?.id);

  if (shouldRedirectToLogin(request.nextUrl.pathname, isAuthenticated)) {
    return NextResponse.redirect(
      new URL(
        loginRedirectPath(request.nextUrl.pathname),
        request.nextUrl.origin,
      ),
    );
  }

  return handleI18n(request);
}) as unknown as AuthProxy;

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!isPrivatePath(request.nextUrl.pathname)) {
    return handleI18n(request);
  }

  if (!process.env.AUTH_SECRET) {
    return NextResponse.redirect(
      new URL(
        loginRedirectPath(request.nextUrl.pathname),
        request.nextUrl.origin,
      ),
    );
  }

  return protectPrivateRoutes(request, event);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
