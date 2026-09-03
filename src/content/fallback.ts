import type { PublicContentSource } from "@/content/source";

async function firstNonEmpty<T>(
  load: () => Promise<readonly T[]>,
  fallback: () => Promise<readonly T[]>,
): Promise<readonly T[]> {
  try {
    const records = await load();
    return records.length > 0 ? records : fallback();
  } catch {
    return fallback();
  }
}

export function withCatalogFallback(
  primary: PublicContentSource,
  fallback: PublicContentSource,
): PublicContentSource {
  return {
    listProjects: () =>
      firstNonEmpty(primary.listProjects, fallback.listProjects),
    listExperience: () =>
      firstNonEmpty(primary.listExperience, fallback.listExperience),
    listSkillCategories: () =>
      firstNonEmpty(primary.listSkillCategories, fallback.listSkillCategories),
    listSkills: () => firstNonEmpty(primary.listSkills, fallback.listSkills),
    listPosts: () => firstNonEmpty(primary.listPosts, fallback.listPosts),
    listResumes: () => firstNonEmpty(primary.listResumes, fallback.listResumes),
    listCertifications: () =>
      firstNonEmpty(primary.listCertifications, fallback.listCertifications),
    listBadges: () => firstNonEmpty(primary.listBadges, fallback.listBadges),
  };
}
