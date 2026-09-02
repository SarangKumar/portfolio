import { siteConfig } from "@/config/site";

export function absoluteUrl(path: string): string {
  const origin = siteConfig.url.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;

  return `${origin}${normalized}`;
}

export function projectPath(slug: string): `/projects/${string}` {
  return `/projects/${slug}`;
}
