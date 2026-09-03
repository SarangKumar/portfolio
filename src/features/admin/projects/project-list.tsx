import NextLink from "next/link";
import {
  buttonClassName,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { AdminProjectSummary } from "@/cms/projects/types";
import { PublicationStatusBadge } from "@/features/admin/publication-status-badge";
import type { PublicationStatus } from "@/content/status";

export type ProjectListCopy = {
  empty: string;
  edit: string;
  status: Record<PublicationStatus, string>;
};

type ProjectListProps = {
  projects: readonly AdminProjectSummary[];
  copy: ProjectListCopy;
};

export function ProjectList({ projects, copy }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <p className="type-small text-muted-foreground" role="status">
        {copy.empty}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border border border-border">
      {projects.map((project) => (
        <li
          key={project.key}
          className="flex flex-wrap items-center justify-between gap-2 px-3 py-2"
        >
          <div className="min-w-0 stack-compact">
            <p className="truncate type-small font-medium">{project.title}</p>
            <p className="truncate type-metadata text-muted-foreground">
              /projects/{project.slug}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PublicationStatusBadge
              status={project.status}
              labels={copy.status}
            />
            <NextLink
              href={`/admin/projects/${project.key}`}
              className="type-small font-medium text-foreground underline-offset-2 hover:underline"
            >
              {copy.edit}
            </NextLink>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ProjectUnavailableNotice({ message }: { message: string }) {
  return (
    <p role="alert" className="type-small text-destructive">
      {message}
    </p>
  );
}

export function CreateProjectLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <NextLink
      href={href}
      className={cn(
        buttonClassName.base,
        buttonVariants.primary,
        buttonSizes.sm,
        "hover:text-primary-foreground",
      )}
    >
      {label}
    </NextLink>
  );
}
