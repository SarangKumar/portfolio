import {
  FEATURED_PROJECT_LIMIT,
  featuredProjectItems,
} from "@/analytics/ranking";
import type { ProjectItem } from "@/data/projects";
import { isPublicSlug } from "@/lib/slug";
import { projectPath } from "@/lib/url";

export function isProjectSlug(value: string): boolean {
  return isPublicSlug(value);
}

export function getProjectBySlug(
  slug: string,
  items: readonly ProjectItem[],
): ProjectItem | undefined {
  if (!isProjectSlug(slug)) {
    return undefined;
  }

  return items.find((item) => item.slug === slug);
}

export function featuredProjects(
  items: readonly ProjectItem[],
  viewCounts: Readonly<Record<string, number>> = {},
  limit = FEATURED_PROJECT_LIMIT,
): readonly ProjectItem[] {
  return featuredProjectItems(items, viewCounts, limit);
}

export function projectHref(slug: string): `/projects/${string}` {
  return projectPath(slug);
}

export const projectCaseStudyFields = [
  "description",
  "architecture",
  "problem",
  "solution",
  "challenges",
  "decisions",
  "tradeoffs",
  "testing",
  "performance",
  "futureImprovements",
] as const;

export type ProjectCaseStudyField = (typeof projectCaseStudyFields)[number];

export function projectCaseStudyEntries(
  project: ProjectItem,
): readonly { id: ProjectCaseStudyField; body: string }[] {
  return projectCaseStudyFields.flatMap((field) => {
    const body = project[field];
    return body ? [{ id: field, body }] : [];
  });
}
