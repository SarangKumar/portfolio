export type AnalyticsIdentity = {
  sessionId: string;
  visitorId: string;
};

export const analyticsCookieNames = {
  session: "pf_sid",
  visitor: "pf_vid",
} as const;

const TOKEN_PATTERN = /^[A-Za-z0-9._-]{8,64}$/;
export const ANALYTICS_SESSION_MAX_AGE = 60 * 30;
export const ANALYTICS_VISITOR_MAX_AGE = 60 * 60 * 24 * 180;

export type AnalyticsCookieJar = {
  get(name: string): { value: string } | undefined;
  set(
    name: string,
    value: string,
    options: {
      httpOnly: boolean;
      sameSite: "lax";
      path: string;
      secure: boolean;
      maxAge: number;
    },
  ): void;
};

export function isAnalyticsIdentityToken(value: string): boolean {
  return TOKEN_PATTERN.test(value);
}

export function createAnalyticsIdentityToken(): string {
  return crypto.randomUUID();
}

export function analyticsCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge,
  };
}

function tokenFromCookie(
  store: AnalyticsCookieJar,
  name: string,
): string | undefined {
  const value = store.get(name)?.value;

  if (!value || !isAnalyticsIdentityToken(value)) {
    return undefined;
  }

  return value;
}

export function resolveAnalyticsIdentity(
  store: AnalyticsCookieJar,
): AnalyticsIdentity {
  const sessionId =
    tokenFromCookie(store, analyticsCookieNames.session) ??
    createAnalyticsIdentityToken();
  const visitorId =
    tokenFromCookie(store, analyticsCookieNames.visitor) ??
    createAnalyticsIdentityToken();

  store.set(
    analyticsCookieNames.session,
    sessionId,
    analyticsCookieOptions(ANALYTICS_SESSION_MAX_AGE),
  );
  store.set(
    analyticsCookieNames.visitor,
    visitorId,
    analyticsCookieOptions(ANALYTICS_VISITOR_MAX_AGE),
  );

  return { sessionId, visitorId };
}
