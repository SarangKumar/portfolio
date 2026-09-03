import type { NextAuthConfig } from "next-auth";

export const AUTH_SESSION_MAX_AGE = 60 * 60 * 8;

export const authConfig = {
  trustHost: true,
  providers: [],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: AUTH_SESSION_MAX_AGE,
    updateAge: 60 * 30,
  },
  jwt: {
    maxAge: AUTH_SESSION_MAX_AGE,
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    authorized() {
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.email = token.email ?? "";
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
