import type { BadgeCredential } from "@/data/badges";
import type { BlogPost } from "@/data/blog";
import type { Certification } from "@/data/certifications";
import type { PublicExperience } from "@/data/experience";
import type { ProjectItem } from "@/data/projects";
import type { ResumeVersion } from "@/data/resumes";
import type { Skill, SkillCategory } from "@/data/skills";
import {
  toPublicBadge,
  toPublicBlogPost,
  toPublicCertification,
  toPublicExperience,
  toPublicProject,
  toPublicResume,
  toPublicSkill,
  toPublicSkillCategory,
} from "@/content/mappers";
import type {
  PersistedBadge,
  PersistedBlogPost,
  PersistedCertification,
  PersistedExperience,
  PersistedProject,
  PersistedResume,
  PersistedSkill,
  PersistedSkillCategory,
} from "@/content/records";
import { isPublishedStatus } from "@/content/status";
import { getPostBySlug } from "@/lib/blog";
import { getProjectBySlug } from "@/lib/projects";

function published<T extends { status: string }>(records: readonly T[]): T[] {
  return records.filter((record) => isPublishedStatus(record.status));
}

export function publishedProjects(
  records: readonly PersistedProject[],
): readonly ProjectItem[] {
  return published(records).map(toPublicProject);
}

export function publishedProjectBySlug(
  slug: string,
  records: readonly PersistedProject[],
): ProjectItem | null {
  return getProjectBySlug(slug, publishedProjects(records)) ?? null;
}

export function publishedExperience(
  records: readonly PersistedExperience[],
): readonly PublicExperience[] {
  return [...published(records)]
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder || b.startDate.localeCompare(a.startDate),
    )
    .map(toPublicExperience);
}

export function publishedSkillCatalog(
  categories: readonly PersistedSkillCategory[],
  skills: readonly PersistedSkill[],
): {
  categories: readonly SkillCategory[];
  skills: readonly Skill[];
} {
  const visibleCategories = new Map(
    published(categories).map((category) => [category.key, category]),
  );
  const visibleSkills = published(skills).filter((skill) =>
    visibleCategories.has(skill.categoryKey),
  );

  return {
    categories: [...visibleCategories.values()]
      .sort(
        (a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label),
      )
      .map(toPublicSkillCategory),
    skills: visibleSkills.map(toPublicSkill),
  };
}

export function publishedBlogPosts(
  records: readonly PersistedBlogPost[],
): readonly BlogPost[] {
  return published(records)
    .map(toPublicBlogPost)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function publishedBlogPostBySlug(
  slug: string,
  records: readonly PersistedBlogPost[],
): BlogPost | null {
  return getPostBySlug(slug, publishedBlogPosts(records)) ?? null;
}

export function publishedResumeVersions(
  records: readonly PersistedResume[],
): readonly ResumeVersion[] {
  return published(records).map(toPublicResume);
}

export function publishedCertifications(
  records: readonly PersistedCertification[],
): readonly Certification[] {
  return published(records).map(toPublicCertification);
}

export function publishedBadges(
  records: readonly PersistedBadge[],
): readonly BadgeCredential[] {
  return published(records).map(toPublicBadge);
}
