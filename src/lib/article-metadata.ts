import type { Metadata } from "next";
import type { BlogPost } from "@/data/blog";
import { articleHref } from "@/lib/blog";
import { absoluteUrl } from "@/lib/url";

export function articleCanonicalUrl(slug: string): string {
  return absoluteUrl(articleHref(slug));
}

export function articleMetadata(post: BlogPost): Metadata {
  const url = articleCanonicalUrl(post.slug);
  const imageUrl = post.coverImage
    ? post.coverImage.src.startsWith("http")
      ? post.coverImage.src
      : absoluteUrl(post.coverImage.src)
    : undefined;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: [...post.tags],
      images: imageUrl
        ? [{ url: imageUrl, alt: post.coverImage?.alt }]
        : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
    },
  };
}
