"use client";

import { IconText } from "@/components/site/icon-text";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Project } from "@/content/types";
import { ProjectIcon } from "./project-icon";
import { useT } from "./labels-provider";

/** Project row with a rich hover/focus popover; click opens the case study. */
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const t = useT();
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger>
        <Link
          href={`/projects/${project.slug}`}
          className="group border-border lift fade-up grid gap-2 border-b py-6 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-6"
          style={{ ["--delay" as string]: `${index * 60}ms` }}
        >
          <span className="tag">{String(index + 1).padStart(2, "0")}</span>
          <span className="flex items-start gap-4">
            <span
              data-parallax="-0.06"
              data-parallax-max="12"
              className="shrink-0"
            >
              <ProjectIcon
                src={project.icon}
                title={project.title}
                size={52}
                morph={project.slug}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </span>
            <span>
              <span className="display group-hover:text-primary block text-3xl transition-colors sm:text-4xl">
                {project.title}
              </span>
              <span className="text-muted-foreground mt-2 block max-w-2xl text-sm">
                {project.summary}
              </span>
            </span>
          </span>
          <span className="tag flex items-center gap-2">
            {t(`project.kind.${project.kind}`)} · {project.year}
            <ArrowUpRight
              size={16}
              strokeWidth={1.75}
              aria-hidden
              className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="start" className="w-[22rem] p-0">
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-3">
              <ProjectIcon src={project.icon} title={project.title} size={36} />
              <span className="font-serif text-xl">{project.title}</span>
            </span>
            <span className="chip">
              <span className="bean bg-primary size-2" />
              {t(`project.kind.${project.kind}`)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{project.description}</p>
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-4 pt-1 text-sm">
            <Link href={`/projects/${project.slug}`} className="link-u">
              {t("project.caseStudy")}
            </Link>
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="link-u"
              >
                <IconText text={t("project.live")} />
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="link-u"
              >
                <IconText text={t("project.source")} />
              </a>
            ) : null}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
