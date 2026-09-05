import "server-only";

import { getPrismaClient } from "@/db/client";
import { executeDatabaseOperation } from "@/db/operation";
import type {
  PersistedBadge,
  PersistedBlogCover,
  PersistedBlogPost,
  PersistedCertification,
  PersistedExperience,
  PersistedProject,
  PersistedProjectMedia,
  PersistedProjectSection,
  PersistedResume,
  PersistedSkill,
  PersistedSkillCategory,
} from "@/content/records";
import type { PublicContentSource } from "@/content/source";
import type { PublicationStatus } from "@/content/status";

const published = { status: "published" as const };

function asStatus(value: string): PublicationStatus {
  if (value === "draft" || value === "published" || value === "archived") {
    return value;
  }

  return "draft";
}

function dateStamp(value: Date | null): string | null {
  return value ? value.toISOString().slice(0, 10) : null;
}

function isoStamp(value: Date): string {
  return value.toISOString();
}

function mapMedia(
  media: readonly {
    src: string;
    alt: string;
    width: number | null;
    height: number | null;
    kind: string | null;
  }[],
): PersistedProjectMedia[] {
  return media.map((item) => ({
    src: item.src,
    alt: item.alt,
    width: item.width,
    height: item.height,
    kind: item.kind,
  }));
}

function mapSections(
  sections: readonly { key: string; title: string; body: string }[],
): PersistedProjectSection[] {
  return sections.map((section) => ({
    key: section.key,
    title: section.title,
    body: section.body,
  }));
}

export const prismaContentSource: PublicContentSource = {
  async listProjects(): Promise<readonly PersistedProject[]> {
    return executeDatabaseOperation(async () => {
      const rows = await getPrismaClient().project.findMany({
        where: published,
        orderBy: { createdAt: "asc" },
        omit: { internalNotes: true },
      });

      return rows.map((row) => ({
        key: row.key,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        description: row.description,
        technologies: row.technologies,
        skillKeys: row.skillKeys,
        githubUrl: row.githubUrl,
        demoUrl: row.demoUrl,
        media: mapMedia(row.media),
        architecture: row.architecture,
        problem: row.problem,
        solution: row.solution,
        challenges: row.challenges,
        decisions: row.decisions,
        tradeoffs: row.tradeoffs,
        testing: row.testing,
        performance: row.performance,
        futureImprovements: row.futureImprovements,
        sections: mapSections(row.sections),
        experienceKeys: row.experienceKeys,
        status: asStatus(row.status),
        internalNotes: null,
      }));
    });
  },

  async listExperience(): Promise<readonly PersistedExperience[]> {
    return executeDatabaseOperation(async () => {
      const rows = await getPrismaClient().experience.findMany({
        where: published,
        orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
        omit: { internalNotes: true },
      });

      return rows.map((row) => ({
        key: row.key,
        company: row.company,
        role: row.role,
        startDate: row.startDate,
        endDate: row.endDate,
        description: row.description,
        technologies: row.technologies,
        skillKeys: row.skillKeys,
        projectKeys: row.projectKeys,
        achievements: row.achievements,
        status: asStatus(row.status),
        sortOrder: row.sortOrder,
        internalNotes: null,
      }));
    });
  },

  async listSkillCategories(): Promise<readonly PersistedSkillCategory[]> {
    return executeDatabaseOperation(async () => {
      const rows = await getPrismaClient().skillCategory.findMany({
        where: published,
        orderBy: { sortOrder: "asc" },
      });

      return rows.map((row) => ({
        key: row.key,
        label: row.label,
        sortOrder: row.sortOrder,
        status: asStatus(row.status),
      }));
    });
  },

  async listSkills(): Promise<readonly PersistedSkill[]> {
    return executeDatabaseOperation(async () => {
      const rows = await getPrismaClient().skill.findMany({
        where: {
          status: "published",
          category: { status: "published" },
        },
        include: { category: true },
      });

      return rows.map((row) => ({
        key: row.key,
        name: row.name,
        categoryKey: row.category.key,
        status: asStatus(row.status),
      }));
    });
  },

  async listPosts(): Promise<readonly PersistedBlogPost[]> {
    return executeDatabaseOperation(async () => {
      const rows = await getPrismaClient().blogPost.findMany({
        where: published,
        orderBy: { publishedAt: "desc" },
        omit: { internalNotes: true },
      });

      return rows.map((row) => ({
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        content: row.content,
        publishedAt:
          dateStamp(row.publishedAt) ?? row.publishedAt.toISOString(),
        updatedAt: dateStamp(row.updatedAt),
        tags: row.tags,
        categories: row.categories,
        coverImage: mapCover(row.coverImage),
        status: asStatus(row.status),
        internalNotes: null,
      }));
    });
  },

  async listResumes(): Promise<readonly PersistedResume[]> {
    return executeDatabaseOperation(async () => {
      const rows = await getPrismaClient().resumeVersion.findMany({
        where: published,
        orderBy: { createdAt: "asc" },
        omit: { internalNotes: true },
      });

      return rows.map((row) => ({
        key: row.key,
        label: row.label,
        targetType: row.targetType,
        overview: row.overview,
        notes: row.notes,
        previewSrc: row.previewSrc,
        previewKind: row.previewKind,
        fileSrc: row.fileSrc,
        fileName: row.fileName,
        isDefault: row.isDefault,
        status: asStatus(row.status),
        createdAt: isoStamp(row.createdAt),
        updatedAt: isoStamp(row.updatedAt),
        internalNotes: null,
      }));
    });
  },

  async listCertifications(): Promise<readonly PersistedCertification[]> {
    return executeDatabaseOperation(async () => {
      const rows = await getPrismaClient().certification.findMany({
        where: published,
        orderBy: { createdAt: "asc" },
        omit: { internalNotes: true },
      });

      return rows.map((row) => ({
        key: row.key,
        name: row.name,
        issuer: row.issuer,
        issuedOn: row.issuedOn,
        credentialId: row.credentialId,
        verificationUrl: row.verificationUrl,
        mediaSrc: row.mediaSrc,
        skillKeys: row.skillKeys,
        status: asStatus(row.status),
        internalNotes: null,
      }));
    });
  },

  async listBadges(): Promise<readonly PersistedBadge[]> {
    return executeDatabaseOperation(async () => {
      const rows = await getPrismaClient().badge.findMany({
        where: published,
        orderBy: { createdAt: "asc" },
        omit: { internalNotes: true },
      });

      return rows.map((row) => ({
        key: row.key,
        name: row.name,
        issuer: row.issuer,
        issuedOn: row.issuedOn,
        verificationUrl: row.verificationUrl,
        imageSrc: row.imageSrc,
        skillKeys: row.skillKeys,
        status: asStatus(row.status),
        internalNotes: null,
      }));
    });
  },
};

function mapCover(
  cover: { src: string; alt: string } | null,
): PersistedBlogCover | null {
  return cover ? { src: cover.src, alt: cover.alt } : null;
}
