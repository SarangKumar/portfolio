import type { MetadataRoute } from "next";
import { getPublishedBlogPosts, getPublishedProjects } from "@/content/public";
import { publicSitemapEntries } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    getPublishedProjects(),
    getPublishedBlogPosts(),
  ]);

  return publicSitemapEntries(projects, posts);
}
