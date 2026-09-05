import type { BadgeCredential } from "@/data/badges";
import type { BlogPost } from "@/data/blog";
import type { Certification } from "@/data/certifications";
import type { PublicExperience } from "@/data/experience";
import type { ProjectItem, ProjectMedia } from "@/data/projects";
import type { ResumeVersion } from "@/data/resumes";
import type { Skill, SkillCategory } from "@/data/skills";
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

function mediaKind(kind: string | null): ProjectMedia["kind"] {
  return kind === "video" ? "video" : "image";
}

function resumePreviewKind(kind: string | null): ResumeVersion["previewKind"] {
  if (kind === "pdf" || kind === "image") {
    return kind;
  }

  return null;
}

export function toPublicProject(record: PersistedProject): ProjectItem {
  return {
    id: record.key,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    description: record.description,
    technologies: [...record.technologies],
    skillIds: [...record.skillKeys],
    githubUrl: record.githubUrl,
    demoUrl: record.demoUrl,
    media: record.media.map((item) => ({
      src: item.src,
      alt: item.alt,
      width: item.width ?? undefined,
      height: item.height ?? undefined,
      kind: mediaKind(item.kind),
    })),
    architecture: record.architecture,
    problem: record.problem,
    solution: record.solution,
    challenges: record.challenges,
    decisions: record.decisions,
    tradeoffs: record.tradeoffs,
    testing: record.testing,
    performance: record.performance,
    futureImprovements: record.futureImprovements,
    sections: record.sections.map((section) => ({
      id: section.key,
      title: section.title,
      body: section.body,
    })),
    experienceIds: [...record.experienceKeys],
  };
}

export function toPublicExperience(
  record: PersistedExperience,
): PublicExperience {
  return {
    id: record.key,
    company: record.company,
    role: record.role,
    startDate: record.startDate,
    endDate: record.endDate,
    description: record.description,
    technologies: [...record.technologies],
    skillIds: [...record.skillKeys],
    projectIds: [...record.projectKeys],
    achievements: [...record.achievements],
  };
}

export function toPublicSkillCategory(
  record: PersistedSkillCategory,
): SkillCategory {
  return {
    id: record.key,
    label: record.label,
  };
}

export function toPublicSkill(record: PersistedSkill): Skill {
  return {
    id: record.key,
    name: record.name,
    categoryId: record.categoryKey,
  };
}

export function toPublicBlogPost(record: PersistedBlogPost): BlogPost {
  return {
    slug: record.slug,
    title: record.title,
    description: record.summary,
    content: record.content,
    publishedAt: record.publishedAt,
    updatedAt: record.updatedAt,
    tags: [...record.tags],
    categories: [...record.categories],
    coverImage: record.coverImage
      ? { src: record.coverImage.src, alt: record.coverImage.alt }
      : null,
  };
}

export function toPublicResume(record: PersistedResume): ResumeVersion {
  return {
    id: record.key,
    label: record.label,
    targetType: record.targetType,
    overview: record.overview,
    notes: record.notes,
    previewSrc: record.previewSrc,
    previewKind: resumePreviewKind(record.previewKind),
    fileSrc: record.fileSrc,
    fileName: record.fileName,
    isDefault: record.isDefault,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function toPublicCertification(
  record: PersistedCertification,
): Certification {
  return {
    id: record.key,
    name: record.name,
    issuer: record.issuer,
    date: record.issuedOn,
    credentialId: record.credentialId,
    verificationUrl: record.verificationUrl,
    mediaSrc: record.mediaSrc,
    skillIds: [...record.skillKeys],
  };
}

export function toPublicBadge(record: PersistedBadge): BadgeCredential {
  return {
    id: record.key,
    name: record.name,
    issuer: record.issuer,
    date: record.issuedOn,
    verificationUrl: record.verificationUrl,
    imageSrc: record.imageSrc,
    skillIds: [...record.skillKeys],
  };
}
