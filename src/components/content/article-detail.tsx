import { ArticleViewTracker } from "@/analytics/article-view-tracker";
import { MarkdownContent } from "@/components/content/markdown-content";
import { ProjectTags } from "@/components/content/project-tags";
import type { BlogPost } from "@/data/blog";

type ArticleDetailProps = {
  post: BlogPost;
  publishedLabel: string;
  updatedLabel?: string;
  readingLabel: string;
  tagsLabel: string;
  categoriesLabel: string;
};

export function ArticleDetail({
  post,
  publishedLabel,
  updatedLabel,
  readingLabel,
  tagsLabel,
  categoriesLabel,
}: ArticleDetailProps) {
  return (
    <article className="stack-section">
      <ArticleViewTracker slug={post.slug} />
      <header className="stack-compact border-b border-border pb-5">
        <h1 className="type-display">{post.title}</h1>
        <p className="max-w-prose type-body text-muted-foreground">
          {post.description}
        </p>
        <p className="type-metadata">
          {publishedLabel}
          {updatedLabel ? ` · ${updatedLabel}` : ""} · {readingLabel}
        </p>
        <ProjectTags tags={post.tags} label={tagsLabel} />
        <ProjectTags tags={post.categories} label={categoriesLabel} />
      </header>
      {post.coverImage ? (
        // Cover images are authored local or remote assets.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage.src}
          alt={post.coverImage.alt}
          className="aspect-video w-full rounded-md border border-border object-cover bg-muted"
        />
      ) : null}
      <MarkdownContent content={post.content} />
    </article>
  );
}
