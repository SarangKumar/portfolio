import Link from "next/link";
import { ArrowUpRight, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProjectItem } from "@/data/projects";

type ProjectCardProps = {
  project: ProjectItem;
  index?: number;
  /** Bigger title, full description, more tags — for a bento-style lead card. */
  featured?: boolean;
};

const accentVars = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export function ProjectCard({
  project,
  index = 0,
  featured = false,
}: ProjectCardProps) {
  const accent = accentVars[index % accentVars.length];
  const ordinal = String(index + 1).padStart(2, "0");
  const techLimit = featured ? 8 : 5;

  return (
    <Card
      className="lift fade-up group relative h-full overflow-hidden"
      style={{ "--delay": `${index * 60}ms` } as React.CSSProperties}
    >
      {/* Per-project accent spine — gives each card a distinct identity
          without reaching for another icon. */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: accent }}
      />
      {/* Large faint ordinal — a typographic flourish, not decoration for
          decoration's sake: it's how the project sits in the list. */}
      <span
        aria-hidden
        className="text-foreground pointer-events-none absolute -top-3 right-3 font-mono text-6xl font-bold opacity-[0.06] select-none"
      >
        {ordinal}
      </span>

      <CardHeader>
        <CardTitle
          className={`flex items-center justify-between gap-2 ${featured ? "text-xl" : "text-base"}`}
        >
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 rounded-md"
          >
            {project.title}
          </Link>
          <ArrowUpRight className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </CardTitle>
        <CardDescription className={featured ? "text-sm" : undefined}>
          {project.summary}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, techLimit).map((tech) => (
            <Badge key={tech} variant="secondary" className="font-normal">
              {tech}
            </Badge>
          ))}
        </div>
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground relative z-10 inline-flex w-fit items-center gap-1.5 text-xs transition-colors"
          >
            <GitBranch className="size-3.5" />
            Source
          </a>
        ) : null}
      </CardContent>
    </Card>
  );
}
