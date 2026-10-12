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
  return {
    title: site.nav.find((n) => n.href === HREF[key])?.label ?? page.title,
    description: page.intro,
  };
}
