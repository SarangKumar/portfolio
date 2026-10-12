/** Canonical origin for metadata, sitemap, OG and JSON-LD. Set NEXT_PUBLIC_SITE_URL in production; falls back to Vercel's production domain. */
function withScheme(origin: string): string {
  const o = origin.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(o)) return o;
  // Values like "localhost:3000" or "example.com" (no scheme) would break `new URL()`.
  return /^(localhost|127\.0\.0\.1)(:|$)/.test(o)
    ? `http://${o}`
    : `https://${o}`;
}

export const SITE_URL = withScheme(
  process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000",
);

export const abs = (path = "/") =>
  path.startsWith("http")
    ? path
    : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
