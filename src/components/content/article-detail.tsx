import { ArticleViewTracker } from "@/analytics/article-view-tracker";
import { MarkdownContent } from "@/components/content/markdown-content";
import { MediaImage } from "@/components/content/media-image";
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
      <header className="stack-compact border-b border-border pb-8">
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
        <MediaImage
          src={post.coverImage.src}
          alt={post.coverImage.alt}
          width={1200}
          height={675}
          priority
          sizes="(min-width: 768px) 40rem, 100vw"
          className="aspect-video w-full rounded-md border border-border object-cover"
        />
      ) : null}
      <MarkdownContent content={post.content} />
    </article>
  );
}
