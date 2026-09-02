import type { PublicExperience } from "@/data/experience";
import type { Profile } from "@/data/profile";
import type { ProjectItem } from "@/data/projects";
import type { Skill, SkillCategory } from "@/data/skills";

export function isEmptyList<T>(items: readonly T[]): boolean {
  return items.length === 0;
}

export function hasProfileContent(profile: Profile): boolean {
  return Boolean(profile.displayName || profile.headline || profile.summary);
}

export function hasAboutContent(profile: Profile): boolean {
  return Boolean(
    profile.background ||
    profile.philosophy ||
    profile.focusSkillIds.length ||
    profile.expertiseSkillIds.length ||
    profile.interests.length,
  );
}

export type ContentCollections = {
  experience: readonly PublicExperience[];
  projects: readonly ProjectItem[];
  skills: readonly Skill[];
  skillCategories: readonly SkillCategory[];
};

export function skillsByIds(
  ids: readonly string[],
  skills: readonly Skill[],
): readonly Skill[] {
  const byId = new Map(skills.map((skill) => [skill.id, skill]));

  return ids.flatMap((id) => {
    const skill = byId.get(id);
    return skill ? [skill] : [];
  });
}

export function skillsInCategory(
  categoryId: string,
  skills: readonly Skill[],
): readonly Skill[] {
  return skills.filter((skill) => skill.categoryId === categoryId);
}

export function experienceForSkill(
  skillId: string,
  experience: readonly PublicExperience[],
): readonly PublicExperience[] {
  return experience.filter((item) => item.skillIds.includes(skillId));
}

export function projectsForSkill(
  skillId: string,
  projects: readonly ProjectItem[],
): readonly ProjectItem[] {
  return projects.filter((item) => item.skillIds.includes(skillId));
}

export function projectsForExperience(
  experienceId: string,
  experience: readonly PublicExperience[],
  projects: readonly ProjectItem[],
): readonly ProjectItem[] {
  const role = experience.find((item) => item.id === experienceId);
  const fromRole = new Set(role?.projectIds ?? []);

  return projects.filter(
    (item) =>
      fromRole.has(item.id) || item.experienceIds.includes(experienceId),
  );
}

export type SkillEvidence = {
  skillId: string;
  categoryId: string | null;
  projectCount: number;
  experienceCount: number;
};

export function getSkillEvidence(
  skillId: string,
  collections: Pick<ContentCollections, "skills" | "experience" | "projects">,
): SkillEvidence {
  const skill = collections.skills.find((item) => item.id === skillId);

  return {
    skillId,
    categoryId: skill?.categoryId ?? null,
    projectCount: projectsForSkill(skillId, collections.projects).length,
    experienceCount: experienceForSkill(skillId, collections.experience).length,
  };
}

export type SkillCategoryEvidence = {
  categoryId: string;
  label: string;
  skillCount: number;
  projectCount: number;
  experienceCount: number;
};

export function getSkillCategoryEvidence(
  collections: ContentCollections,
): readonly SkillCategoryEvidence[] {
  return collections.skillCategories.map((category) => {
    const members = skillsInCategory(category.id, collections.skills);
    const evidence = members.map((skill) =>
      getSkillEvidence(skill.id, collections),
    );

    return {
      categoryId: category.id,
      label: category.label,
      skillCount: members.length,
      projectCount: evidence.reduce(
        (total, item) => total + item.projectCount,
        0,
      ),
      experienceCount: evidence.reduce(
        (total, item) => total + item.experienceCount,
        0,
      ),
    };
  });
}

export function groupedSkillPreviews(
  categories: readonly SkillCategory[],
  skills: readonly Skill[],
): readonly { id: string; label: string; items: readonly string[] }[] {
  return categories.map((category) => ({
    id: category.id,
    label: category.label,
    items: skillsInCategory(category.id, skills).map((skill) => skill.name),
  }));
}
