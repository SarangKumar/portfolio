import type { BlogPost } from "@/data/blog";
import { isPublicSlug } from "@/lib/slug";
import { articlePath } from "@/lib/url";

export function articleHref(slug: string): `/blog/${string}` {
  return articlePath(slug);
}

export function getPostBySlug(
  slug: string,
  items: readonly BlogPost[],
): BlogPost | undefined {
  if (!isPublicSlug(slug)) {
    return undefined;
  }

  return items.find((item) => item.slug === slug);
}

export function sortPostsByDate(
  items: readonly BlogPost[],
): readonly BlogPost[] {
  return [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

const WORDS_PER_MINUTE = 200;

export function readingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;

  if (words === 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
