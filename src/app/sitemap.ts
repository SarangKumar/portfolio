import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { abs } from "@/lib/site-url";

export const revalidate = 60;

/** Static routes + published projects/posts/diagrams (Firestore, seed fallback). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getContent();
  const pages = [
    ...c.site.nav.map((n) => n.href),
    ...c.site.footerNav.map((n) => n.href),
    "/experience",
  ];
  const statics = [...new Set(pages)].filter((h) => h.startsWith("/"));
  return [
    ...statics.map((h) => ({
      url: abs(h),
      changeFrequency: "weekly" as const,
      priority: h === "/" ? 1 : 0.8,
    })),
    ...c.projects.map((p) => ({
      url: abs(`/projects/${p.slug}`),
      priority: 0.7,
    })),
    ...c.posts.map((p) => ({
      url: abs(`/blogs/${p.slug}`),
      lastModified: p.date ? new Date(p.date) : undefined,
      priority: 0.6,
    })),
    ...c.diagrams.map((d) => ({ url: abs(`/lab/${d.slug}`), priority: 0.5 })),
  ];
}
