import { ProjectTags } from "@/components/content/project-tags";
import type { ProjectItem } from "@/data/projects";
import { cn } from "@/lib/cn";
import { projectHref } from "@/lib/projects";

type ProjectCardProps = {
  project: ProjectItem;
  tagsLabel: string;
  className?: string;
};

export function ProjectCard({
  project,
  tagsLabel,
  className,
}: ProjectCardProps) {
  return (
    <article>
      <a
        href={projectHref(project.slug)}
        className={cn(
          "stack-compact surface-card pad-card rounded-md",
          "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          "hover:border-primary/40 focus-visible:outline-2",
          className,
        )}
      >
        <p className="type-small font-semibold text-card-foreground">
          {project.title}
        </p>
        <p className="type-small text-muted-foreground">{project.summary}</p>
        <ProjectTags tags={project.technologies} label={tagsLabel} />
      </a>
    </article>
  );
}
