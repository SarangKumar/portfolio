/** Canonical origin for metadata, sitemap, OG and JSON-LD. Set NEXT_PUBLIC_SITE_URL in production; falls back to Vercel's production domain. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
).replace(/\/+$/, "");

export const abs = (path = "/") =>
  path.startsWith("http")
    ? path
    : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
