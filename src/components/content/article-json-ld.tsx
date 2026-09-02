import type { BlogPost } from "@/data/blog";
import { absoluteUrl } from "@/lib/url";

type ArticleJsonLdProps = {
  post: BlogPost;
  canonicalUrl: string;
};

export function ArticleJsonLd({ post, canonicalUrl }: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    keywords: [...post.tags, ...post.categories].join(", ") || undefined,
    image: post.coverImage
      ? post.coverImage.src.startsWith("http")
        ? post.coverImage.src
        : absoluteUrl(post.coverImage.src)
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
