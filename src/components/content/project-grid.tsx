import type { ReactNode } from "react";
import { ProjectCard } from "@/components/content/project-card";
import type { ProjectItem } from "@/data/projects";

type ProjectGridProps = {
  projects: readonly ProjectItem[];
  tagsLabel: string;
  empty: ReactNode;
};

export function ProjectGrid({ projects, tagsLabel, empty }: ProjectGridProps) {
  if (projects.length === 0) {
    return empty;
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {projects.map((project) => (
        <li key={project.slug}>
          <ProjectCard project={project} tagsLabel={tagsLabel} />
        </li>
      ))}
    </ul>
  );
}
