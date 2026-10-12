import type { Metadata } from "next";
import type { PageKey } from "@/content/types";
import { getContent } from "./content";

const HREF: Record<PageKey, string> = {
  projects: "/projects",
  blogs: "/blogs",
  library: "/library",
  lab: "/lab",
  board: "/board",
};

/** Metadata for a top-level page, from the nav label + page copy in site config. */
export async function pageMetadata(key: PageKey): Promise<Metadata> {
  const { site } = await getContent();
  const page = site.pages[key];
  const title =
    [...site.nav, ...site.footerNav].find((n) => n.href === HREF[key])?.label ??
    page.title;
  return seoMeta(title, page.intro, HREF[key], site.name);
}

/** title/description/canonical + matching Open Graph & Twitter fields. */
export function seoMeta(
  title: string | undefined,
  description: string | undefined,
  path: string,
  siteName?: string,
): Metadata {
  const full = title && siteName ? `${title} — ${siteName}` : title;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: full, description, url: path },
    twitter: { card: "summary_large_image", title: full, description },
  };
}
