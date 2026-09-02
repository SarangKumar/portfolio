import type { Metadata } from "next";
import type { ProjectItem } from "@/data/projects";
import { projectHref } from "@/lib/projects";
import { shareMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/url";

export function projectCanonicalUrl(slug: string): string {
  return absoluteUrl(projectHref(slug));
}

export function projectMetadata(project: ProjectItem): Metadata {
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
    ...shareMetadata({
      title: project.title,
      description,
      path: projectHref(project.slug),
      images: imageUrl ? [{ url: imageUrl, alt: image?.alt }] : undefined,
    }),
  };
}
