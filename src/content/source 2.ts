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

export type PublicContentSource = {
  listProjects(): Promise<readonly PersistedProject[]>;
  listExperience(): Promise<readonly PersistedExperience[]>;
  listSkillCategories(): Promise<readonly PersistedSkillCategory[]>;
  listSkills(): Promise<readonly PersistedSkill[]>;
  listPosts(): Promise<readonly PersistedBlogPost[]>;
  listResumes(): Promise<readonly PersistedResume[]>;
  listCertifications(): Promise<readonly PersistedCertification[]>;
  listBadges(): Promise<readonly PersistedBadge[]>;
};
