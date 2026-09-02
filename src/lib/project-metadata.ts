import type { Metadata } from "next";
import type { ProjectItem } from "@/data/projects";
import { projectHref } from "@/lib/projects";
import { absoluteUrl } from "@/lib/url";

export function projectCanonicalUrl(slug: string): string {
  return absoluteUrl(projectHref(slug));
}

export function projectMetadata(project: ProjectItem): Metadata {
  const url = projectCanonicalUrl(project.slug);
  const description = project.summary;
  const image = project.media.find((item) => item.kind !== "video");
  const imageUrl = image
    ? image.src.startsWith("http")
      ? image.src
      : absoluteUrl(image.src)
    : undefined;

  return {
    title: project.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: project.title,
      description,
      url,
      images: imageUrl ? [{ url: imageUrl, alt: image?.alt }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: project.title,
      description,
    },
  };
}
