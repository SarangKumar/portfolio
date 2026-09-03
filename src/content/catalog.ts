import { badges } from "@/data/badges";
import { posts } from "@/data/blog";
import { certifications } from "@/data/certifications";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { resumes } from "@/data/resumes";
import { skillCategories, skills } from "@/data/skills";
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
import type { PublicContentSource } from "@/content/source";
import { PUBLICATION_STATUS_PUBLISHED } from "@/content/status";

export function catalogProjectRecords(): readonly PersistedProject[] {
  return projects.map((project) => ({
    key: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    description: project.description,
    technologies: project.technologies,
    skillKeys: project.skillIds,
    githubUrl: project.githubUrl,
    demoUrl: project.demoUrl,
    media: project.media.map((item) => ({
      src: item.src,
      alt: item.alt,
      width: item.width ?? null,
      height: item.height ?? null,
      kind: item.kind ?? null,
    })),
    architecture: project.architecture,
    problem: project.problem,
    solution: project.solution,
    challenges: project.challenges,
    decisions: project.decisions,
    tradeoffs: project.tradeoffs,
    testing: project.testing,
    performance: project.performance,
    futureImprovements: project.futureImprovements,
    sections: project.sections.map((section) => ({
      key: section.id,
      title: section.title,
      body: section.body,
    })),
    experienceKeys: project.experienceIds,
    status: PUBLICATION_STATUS_PUBLISHED,
    internalNotes: null,
  }));
}

export function catalogExperienceRecords(): readonly PersistedExperience[] {
  return experience.map((item, index) => ({
    key: item.id,
    company: item.company,
    role: item.role,
    startDate: item.startDate,
    endDate: item.endDate,
    description: item.description,
    technologies: item.technologies,
    skillKeys: item.skillIds,
    projectKeys: item.projectIds,
    achievements: item.achievements,
    status: PUBLICATION_STATUS_PUBLISHED,
    sortOrder: index,
    internalNotes: null,
  }));
}

export function catalogSkillCategoryRecords(): readonly PersistedSkillCategory[] {
  return skillCategories.map((category, index) => ({
    key: category.id,
    label: category.label,
    sortOrder: index,
    status: PUBLICATION_STATUS_PUBLISHED,
  }));
}

export function catalogSkillRecords(): readonly PersistedSkill[] {
  return skills.map((skill) => ({
    key: skill.id,
    name: skill.name,
    categoryKey: skill.categoryId,
    status: PUBLICATION_STATUS_PUBLISHED,
  }));
}

export function catalogBlogRecords(): readonly PersistedBlogPost[] {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    summary: post.description,
    content: post.content,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    tags: post.tags,
    categories: post.categories,
    coverImage: post.coverImage,
    status: PUBLICATION_STATUS_PUBLISHED,
    internalNotes: null,
  }));
}

export function catalogResumeRecords(): readonly PersistedResume[] {
  return resumes.map((resume) => ({
    key: resume.id,
    label: resume.label,
    targetType: resume.targetType,
    overview: resume.overview,
    notes: resume.notes,
    previewSrc: resume.previewSrc,
    previewKind: resume.previewKind,
    fileSrc: resume.fileSrc,
    fileName: resume.fileName,
    isDefault: resume.isDefault,
    status: PUBLICATION_STATUS_PUBLISHED,
    createdAt: resume.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: resume.updatedAt ?? "2026-01-01T00:00:00.000Z",
    internalNotes: null,
  }));
}

export function catalogCertificationRecords(): readonly PersistedCertification[] {
  return certifications.map((item) => ({
    key: item.id,
    name: item.name,
    issuer: item.issuer,
    issuedOn: item.date,
    credentialId: item.credentialId,
    verificationUrl: item.verificationUrl,
    mediaSrc: item.mediaSrc,
    skillKeys: item.skillIds,
    status: PUBLICATION_STATUS_PUBLISHED,
    internalNotes: null,
  }));
}

export function catalogBadgeRecords(): readonly PersistedBadge[] {
  return badges.map((item) => ({
    key: item.id,
    name: item.name,
    issuer: item.issuer,
    issuedOn: item.date,
    verificationUrl: item.verificationUrl,
    imageSrc: item.imageSrc,
    skillKeys: item.skillIds,
    status: PUBLICATION_STATUS_PUBLISHED,
    internalNotes: null,
  }));
}

export const catalogContentSource: PublicContentSource = {
  listProjects: async () => catalogProjectRecords(),
  listExperience: async () => catalogExperienceRecords(),
  listSkillCategories: async () => catalogSkillCategoryRecords(),
  listSkills: async () => catalogSkillRecords(),
  listPosts: async () => catalogBlogRecords(),
  listResumes: async () => catalogResumeRecords(),
  listCertifications: async () => catalogCertificationRecords(),
  listBadges: async () => catalogBadgeRecords(),
};
