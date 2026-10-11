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
};

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <Card
      className="lift fade-up group h-full"
      style={{ "--delay": `${index * 60}ms` } as React.CSSProperties}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 rounded-md"
          >
            {project.title}
          </Link>
          <ArrowUpRight className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
        </CardTitle>
        <CardDescription>{project.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((tech) => (
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
