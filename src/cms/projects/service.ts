import type { Admin } from "@/admin/model";
import { ignoreContentMutation, type RecordContentMutation } from "@/cms/audit";
import { ContentNotFoundError, DuplicateSlugError } from "@/cms/errors";
import { createProjectKey } from "@/cms/projects/key";
import {
  archivedProjectStatus,
  publishedProjectStatus,
  unpublishedProjectStatus,
} from "@/cms/projects/status";
import type { ProjectStore } from "@/cms/projects/store";
import type {
  AdminProjectRecord,
  AdminProjectSummary,
  ProjectWriteInput,
} from "@/cms/projects/types";
import type { MutationResult } from "@/cms/result";
import type { InvalidatePublicProject } from "@/cms/revalidate";
import { DatabaseError } from "@/db/errors";

export type ProjectServiceClock = () => Date;

export type ProjectServiceDependencies = {
  store: ProjectStore;
  invalidate: InvalidatePublicProject;
  now?: ProjectServiceClock;
  recordMutation?: RecordContentMutation;
};

function asUnavailable(error: unknown): MutationResult<never> {
  if (error instanceof DuplicateSlugError) {
    return {
      ok: false,
      code: "duplicateSlug",
      fieldErrors: { slug: "duplicate" },
    };
  }

  if (error instanceof ContentNotFoundError) {
    return { ok: false, code: "notFound" };
  }

  if (error instanceof DatabaseError) {
    return { ok: false, code: "unavailable" };
  }

  throw error;
}

function emptyProject(
  key: string,
  input: ProjectWriteInput,
  at: string,
): AdminProjectRecord {
  return {
    key,
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    description: input.description,
    technologies: [...input.technologies],
    skillKeys: [...input.skillKeys],
    githubUrl: input.githubUrl,
    demoUrl: input.demoUrl,
    media: [],
    architecture: null,
    problem: null,
    solution: null,
    challenges: null,
    decisions: null,
    tradeoffs: null,
    testing: null,
    performance: null,
    futureImprovements: null,
    sections: [],
    experienceKeys: [],
    status: unpublishedProjectStatus(),
    internalNotes: input.internalNotes,
    publishedAt: null,
    updatedAt: at,
  };
}

export function createProjectService(deps: ProjectServiceDependencies) {
  const now = deps.now ?? (() => new Date());
  const recordMutation = deps.recordMutation ?? ignoreContentMutation;

  async function assertSlugAvailable(slug: string, currentKey?: string) {
    const existing = await deps.store.getBySlug(slug);

    if (existing && existing.key !== currentKey) {
      throw new DuplicateSlugError();
    }
  }

  async function uniqueKey(slug: string): Promise<string> {
    const base = createProjectKey(slug);
    const taken = await deps.store.getByKey(base);

    if (!taken) {
      return base;
    }

    return `${base}-${now().getTime().toString(36)}`;
  }

  return {
    async list(): Promise<MutationResult<readonly AdminProjectSummary[]>> {
      try {
        return { ok: true, value: await deps.store.list() };
      } catch (error) {
        return asUnavailable(error);
      }
    },

    async get(key: string): Promise<MutationResult<AdminProjectRecord>> {
      try {
        const record = await deps.store.getByKey(key);

        if (!record) {
          return { ok: false, code: "notFound" };
        }

        return { ok: true, value: record };
      } catch (error) {
        return asUnavailable(error);
      }
    },

    async create(
      admin: Admin,
      input: ProjectWriteInput,
    ): Promise<MutationResult<AdminProjectRecord>> {
      try {
        await assertSlugAvailable(input.slug);
        const at = now().toISOString();
        const record = await deps.store.create(
          emptyProject(await uniqueKey(input.slug), input, at),
        );
        recordMutation({
          actorId: admin.id,
          entityType: "project",
          entityKey: record.key,
          action: "create",
          at,
        });
        deps.invalidate({ slug: record.slug });
        return { ok: true, value: record };
      } catch (error) {
        return asUnavailable(error);
      }
    },

    async update(
      admin: Admin,
      key: string,
      input: ProjectWriteInput,
    ): Promise<MutationResult<AdminProjectRecord>> {
      try {
        const current = await deps.store.getByKey(key);

        if (!current) {
          return { ok: false, code: "notFound" };
        }

        await assertSlugAvailable(input.slug, key);
        const at = now().toISOString();
        const record = await deps.store.update(key, {
          title: input.title,
          slug: input.slug,
          summary: input.summary,
          description: input.description,
          technologies: [...input.technologies],
          skillKeys: [...input.skillKeys],
          githubUrl: input.githubUrl,
          demoUrl: input.demoUrl,
          internalNotes: input.internalNotes,
          updatedAt: at,
        });
        recordMutation({
          actorId: admin.id,
          entityType: "project",
          entityKey: record.key,
          action: "update",
          at,
        });
        deps.invalidate({
          slug: record.slug,
          previousSlug: current.slug,
        });
        return { ok: true, value: record };
      } catch (error) {
        return asUnavailable(error);
      }
    },

    async publish(
      admin: Admin,
      key: string,
    ): Promise<MutationResult<AdminProjectRecord>> {
      return setStatus(admin, key, "publish", publishedProjectStatus());
    },

    async unpublish(
      admin: Admin,
      key: string,
    ): Promise<MutationResult<AdminProjectRecord>> {
      return setStatus(admin, key, "unpublish", unpublishedProjectStatus());
    },

    async archive(
      admin: Admin,
      key: string,
    ): Promise<MutationResult<AdminProjectRecord>> {
      return setStatus(admin, key, "archive", archivedProjectStatus());
    },
  };

  async function setStatus(
    admin: Admin,
    key: string,
    action: "publish" | "unpublish" | "archive",
    status: ReturnType<typeof publishedProjectStatus>,
  ): Promise<MutationResult<AdminProjectRecord>> {
    try {
      const current = await deps.store.getByKey(key);

      if (!current) {
        return { ok: false, code: "notFound" };
      }

      const at = now().toISOString();
      const record = await deps.store.update(key, {
        status,
        publishedAt:
          action === "publish"
            ? (current.publishedAt ?? at)
            : current.publishedAt,
        updatedAt: at,
      });
      recordMutation({
        actorId: admin.id,
        entityType: "project",
        entityKey: record.key,
        action,
        at,
      });
      deps.invalidate({ slug: record.slug });
      return { ok: true, value: record };
    } catch (error) {
      return asUnavailable(error);
    }
  }
}

export type ProjectService = ReturnType<typeof createProjectService>;
