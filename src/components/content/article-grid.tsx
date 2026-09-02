import type { ReactNode } from "react";
import { ArticleCard } from "@/components/content/article-card";
import type { BlogPost } from "@/data/blog";

type ArticleGridProps = {
  posts: readonly BlogPost[];
  dateLabel: (post: BlogPost) => string;
  readingLabel: (post: BlogPost) => string;
  tagsLabel: string;
  empty: ReactNode;
};

export function ArticleGrid({
  posts,
  dateLabel,
  readingLabel,
  tagsLabel,
  empty,
}: ArticleGridProps) {
  if (posts.length === 0) {
    return empty;
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {posts.map((post) => (
        <li key={post.slug}>
          <ArticleCard
            post={post}
            dateLabel={dateLabel(post)}
            readingLabel={readingLabel(post)}
            tagsLabel={tagsLabel}
          />
        </li>
      ))}
    </ul>
  );
}
