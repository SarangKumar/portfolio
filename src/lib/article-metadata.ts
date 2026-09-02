import type { Metadata } from "next";
import { articleHref } from "@/lib/blog";
import type { BlogPost } from "@/data/blog";
import { shareMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/url";

export function articleCanonicalUrl(slug: string): string {
  return absoluteUrl(articleHref(slug));
}

export function articleMetadata(post: BlogPost): Metadata {
  const imageUrl = post.coverImage
    ? post.coverImage.src.startsWith("http")
      ? post.coverImage.src
      : absoluteUrl(post.coverImage.src)
    : undefined;

  return {
    title: post.title,
    description: post.description,
    ...shareMetadata({
      title: post.title,
      description: post.description,
      path: articleHref(post.slug),
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
      images: imageUrl
        ? [{ url: imageUrl, alt: post.coverImage?.alt }]
        : undefined,
    }),
  };
}
