import { ProjectTags } from "@/components/content/project-tags";
import type { BlogPost } from "@/data/blog";
import { articleHref } from "@/lib/blog";
import { cn } from "@/lib/cn";

type ArticleCardProps = {
  post: BlogPost;
  dateLabel: string;
  readingLabel: string;
  tagsLabel: string;
  className?: string;
};

export function ArticleCard({
  post,
  dateLabel,
  readingLabel,
  tagsLabel,
  className,
}: ArticleCardProps) {
  return (
    <article>
      <a
        href={articleHref(post.slug)}
        className={cn(
          "stack-compact surface-card pad-card rounded-md",
          "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          "hover:border-primary/40",
          className,
        )}
      >
        <p className="type-small font-semibold text-card-foreground">
          {post.title}
        </p>
        <p className="type-small text-muted-foreground">{post.description}</p>
        <p className="type-metadata">
          {dateLabel} · {readingLabel}
        </p>
        <ProjectTags tags={post.tags} label={tagsLabel} />
      </a>
    </article>
  );
}
