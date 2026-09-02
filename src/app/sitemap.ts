import type { MetadataRoute } from "next";
import { publicSitemapEntries } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicSitemapEntries();
}
