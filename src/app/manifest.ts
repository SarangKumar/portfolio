import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { site } = await getContent();
  return {
    name: site.seo.title,
    short_name: site.name,
    description: site.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0805",
    theme_color: "#DD9B5F",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
