"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Project } from "@/content/types";

const KIND: Record<Project["kind"], string> = {
  shipped: "Shipped",
  "in-progress": "In progress",
  idea: "Idea",
};

/** Project row with a rich hover/focus popover; click opens the case study. */
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger>
        <Link
          href={`/projects/${project.slug}`}
          className="group border-border lift fade-up grid gap-2 border-b py-6 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:gap-6"
          style={{ ["--delay" as string]: `${index * 60}ms` }}
        >
          <span className="tag">{String(index + 1).padStart(2, "0")}</span>
          <span>
            <span className="display group-hover:text-primary block text-3xl transition-colors sm:text-4xl">
              {project.title}
            </span>
            <span className="text-muted-foreground mt-2 block max-w-2xl text-sm">
              {project.summary}
            </span>
          </span>
          <span className="tag flex items-center gap-2">
            {KIND[project.kind]} · {project.year}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="start" className="w-[22rem] p-0">
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <span className="font-serif text-xl">{project.title}</span>
            <span className="chip">
              <span className="bean bg-primary size-2" />
              {KIND[project.kind]}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{project.description}</p>
          {project.architecture ? (
            <p className="text-xs">
              <span className="eyebrow">Architecture · </span>
              {project.architecture.slice(0, 160)}…
            </p>
          ) : null}
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-4 pt-1 text-sm">
            <Link href={`/projects/${project.slug}`} className="link-u">
              Case study
            </Link>
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="link-u"
              >
                Live
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="link-u"
              >
                Source
              </a>
            ) : null}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
