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
  limit = 3,
): readonly ProjectItem[] {
  // Ranking is replaceable: pass a different view-count source.
  if (items.length === 0 || limit <= 0) {
    return [];
  }

  const hasPopularity = Object.values(viewCounts).some((count) => count > 0);

  const ranked = hasPopularity
    ? [...items].sort(
        (a, b) => (viewCounts[b.slug] ?? 0) - (viewCounts[a.slug] ?? 0),
      )
    : items;

  return ranked.slice(0, limit);
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
