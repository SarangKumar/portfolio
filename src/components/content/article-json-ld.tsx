import type { BlogPost } from "@/data/blog";
import { JsonLd } from "@/components/seo/json-ld";
import { articleJsonLd } from "@/lib/seo";

type ArticleJsonLdProps = {
  post: BlogPost;
  canonicalUrl: string;
};

export function ArticleJsonLd({ post, canonicalUrl }: ArticleJsonLdProps) {
  return <JsonLd data={articleJsonLd(post, canonicalUrl)} />;
}
