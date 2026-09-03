import "server-only";

import {
  ContentNotFoundError,
  DuplicateSlugError,
  isUniqueConstraintError,
} from "@/cms/errors";
import type { ProjectStore } from "@/cms/projects/store";
import type {
  AdminProjectRecord,
  AdminProjectSummary,
} from "@/cms/projects/types";
import type { PublicationStatus } from "@/content/status";
import { getPrismaClient } from "@/db/client";
import { toDatabaseError } from "@/db/errors";

type ProjectRow = {
  key: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  technologies: string[];
  skillKeys: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  media: {
    src: string;
    alt: string;
    width: number | null;
    height: number | null;
    kind: string | null;
  }[];
  architecture: string | null;
  problem: string | null;
  solution: string | null;
  challenges: string | null;
  decisions: string | null;
  tradeoffs: string | null;
  testing: string | null;
  performance: string | null;
  futureImprovements: string | null;
  sections: { key: string; title: string; body: string }[];
  experienceKeys: string[];
  status: string;
  internalNotes: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

function asStatus(value: string): PublicationStatus {
  if (value === "draft" || value === "published" || value === "archived") {
    return value;
  }

  return "draft";
}

function toRecord(row: ProjectRow): AdminProjectRecord {
  return {
    key: row.key,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    technologies: row.technologies,
    skillKeys: row.skillKeys,
    githubUrl: row.githubUrl,
    demoUrl: row.demoUrl,
    media: row.media.map((item) => ({
      src: item.src,
      alt: item.alt,
      width: item.width,
      height: item.height,
      kind: item.kind,
    })),
    architecture: row.architecture,
    problem: row.problem,
    solution: row.solution,
    challenges: row.challenges,
    decisions: row.decisions,
    tradeoffs: row.tradeoffs,
    testing: row.testing,
    performance: row.performance,
    futureImprovements: row.futureImprovements,
    sections: row.sections.map((section) => ({
      key: section.key,
      title: section.title,
      body: section.body,
    })),
    experienceKeys: row.experienceKeys,
    status: asStatus(row.status),
    internalNotes: row.internalNotes,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    updatedAt: row.updatedAt.toISOString(),
  };
}

function wrap<T>(run: () => Promise<T>): Promise<T> {
  return run().catch((error: unknown) => {
    if (
      error instanceof DuplicateSlugError ||
      error instanceof ContentNotFoundError
    ) {
      throw error;
    }

    if (isUniqueConstraintError(error)) {
      throw new DuplicateSlugError();
    }

    throw toDatabaseError(error);
  });
}

function writeData(record: AdminProjectRecord) {
  return {
    key: record.key,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    description: record.description,
    technologies: [...record.technologies],
    skillKeys: [...record.skillKeys],
    githubUrl: record.githubUrl,
    demoUrl: record.demoUrl,
    media: record.media.map((item) => ({
      src: item.src,
      alt: item.alt,
      width: item.width ?? null,
      height: item.height ?? null,
      kind: item.kind ?? null,
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
      key: section.key,
      title: section.title,
      body: section.body,
    })),
    experienceKeys: [...record.experienceKeys],
    status: record.status,
    internalNotes: record.internalNotes,
    publishedAt: record.publishedAt ? new Date(record.publishedAt) : null,
  };
}

export const prismaProjectStore: ProjectStore = {
  list() {
    return wrap(async () => {
      const rows = await getPrismaClient().project.findMany({
        orderBy: { updatedAt: "desc" },
        select: {
          key: true,
          slug: true,
          title: true,
          status: true,
          updatedAt: true,
        },
      });

      return rows.map((row): AdminProjectSummary => ({
        key: row.key,
        slug: row.slug,
        title: row.title,
        status: asStatus(row.status),
        updatedAt: row.updatedAt.toISOString(),
      }));
    });
  },

  getByKey(key) {
    return wrap(async () => {
      const row = await getPrismaClient().project.findUnique({
        where: { key },
      });
      return row ? toRecord(row) : null;
    });
  },

  getBySlug(slug) {
    return wrap(async () => {
      const row = await getPrismaClient().project.findUnique({
        where: { slug },
      });
      return row ? toRecord(row) : null;
    });
  },

  create(record) {
    return wrap(async () => {
      const row = await getPrismaClient().project.create({
        data: writeData(record),
      });
      return toRecord(row);
    });
  },

  update(key, patch) {
    return wrap(async () => {
      const current = await getPrismaClient().project.findUnique({
        where: { key },
      });

      if (!current) {
        throw new ContentNotFoundError();
      }

      const merged = { ...toRecord(current), ...patch };
      const row = await getPrismaClient().project.update({
        where: { key },
        data: writeData(merged),
      });
      return toRecord(row);
    });
  },
};
