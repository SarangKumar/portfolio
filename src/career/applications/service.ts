import type { Admin } from "@/admin/model";
import { ignoreContentMutation, type RecordContentMutation } from "@/cms/audit";
import { ContentNotFoundError } from "@/cms/errors";
import type { MutationResult } from "@/cms/result";
import { createJobApplicationKey } from "@/career/applications/key";
import type { JobApplicationStore } from "@/career/applications/store";
import type {
  JobApplicationListQuery,
  JobApplicationRecord,
  JobApplicationSummary,
  JobApplicationWriteInput,
} from "@/career/applications/types";
import { DatabaseError } from "@/db/errors";

export type JobApplicationServiceClock = () => Date;

export type JobApplicationServiceDependencies = {
  store: JobApplicationStore;
  now?: JobApplicationServiceClock;
  recordMutation?: RecordContentMutation;
};

function asUnavailable(error: unknown): MutationResult<never> {
  if (error instanceof ContentNotFoundError) {
    return { ok: false, code: "notFound" };
  }

  if (error instanceof DatabaseError) {
    return { ok: false, code: "unavailable" };
  }

  throw error;
}

function toSummary(record: JobApplicationRecord): JobApplicationSummary {
  return {
    key: record.key,
    company: record.company,
    role: record.role,
    status: record.status,
    priority: record.priority,
    appliedAt: record.appliedAt,
    nextActionAt: record.nextActionAt,
    archivedAt: record.archivedAt,
    updatedAt: record.updatedAt,
  };
}

function applyWrite(
  current: JobApplicationRecord,
  input: JobApplicationWriteInput,
  at: string,
): JobApplicationRecord {
  return {
    ...current,
    company: input.company,
    companyKey: input.companyKey,
    role: input.role,
    jobUrl: input.jobUrl,
    location: input.location,
    workMode: input.workMode,
    jobDescription: input.jobDescription,
    salaryAmount: input.salaryAmount,
    salaryCurrency: input.salaryCurrency,
    appliedAt: input.appliedAt,
    status: input.status,
    source: input.source,
    referral: input.referral,
    recruiter: input.recruiter,
    resumeVersionKey: input.resumeVersionKey,
    coverLetterKey: input.coverLetterKey,
    notes: input.notes,
    priority: input.priority,
    nextAction: input.nextAction,
    nextActionAt: input.nextActionAt,
    rejectionReason: input.rejectionReason,
    updatedAt: at,
  };
}

export function createJobApplicationService(
  deps: JobApplicationServiceDependencies,
) {
  const now = deps.now ?? (() => new Date());
  const recordMutation = deps.recordMutation ?? ignoreContentMutation;
  let keySequence = 0;

  function uniqueKey(admin: Admin): string {
    keySequence += 1;
    return `${createJobApplicationKey(now())}-${admin.id.slice(0, 8)}-${keySequence.toString(36)}`;
  }

  return {
    async list(
      admin: Admin,
      query: JobApplicationListQuery = {},
    ): Promise<MutationResult<readonly JobApplicationSummary[]>> {
      try {
        return {
          ok: true,
          value: await deps.store.list(admin.id, query),
        };
      } catch (error) {
        return asUnavailable(error);
      }
    },

    async get(
      admin: Admin,
      key: string,
    ): Promise<MutationResult<JobApplicationRecord>> {
      try {
        const record = await deps.store.getByKey(admin.id, key);

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
      input: JobApplicationWriteInput,
    ): Promise<MutationResult<JobApplicationRecord>> {
      try {
        const at = now().toISOString();
        const record: JobApplicationRecord = {
          key: uniqueKey(admin),
          ownerIdentityId: admin.id,
          archivedAt: null,
          interviewRounds: [],
          createdAt: at,
          updatedAt: at,
          ...input,
        };
        const created = await deps.store.create(record);

        recordMutation({
          actorId: admin.id,
          entityType: "jobApplication",
          entityKey: created.key,
          action: "create",
          at,
        });

        return { ok: true, value: created };
      } catch (error) {
        return asUnavailable(error);
      }
    },

    async update(
      admin: Admin,
      key: string,
      input: JobApplicationWriteInput,
    ): Promise<MutationResult<JobApplicationRecord>> {
      try {
        const current = await deps.store.getByKey(admin.id, key);

        if (!current) {
          return { ok: false, code: "notFound" };
        }

        const at = now().toISOString();
        const updated = await deps.store.update(
          admin.id,
          key,
          applyWrite(current, input, at),
        );

        recordMutation({
          actorId: admin.id,
          entityType: "jobApplication",
          entityKey: key,
          action: "update",
          at,
        });

        return { ok: true, value: updated };
      } catch (error) {
        return asUnavailable(error);
      }
    },

    async archive(
      admin: Admin,
      key: string,
    ): Promise<MutationResult<JobApplicationSummary>> {
      try {
        const current = await deps.store.getByKey(admin.id, key);

        if (!current) {
          return { ok: false, code: "notFound" };
        }

        const at = now().toISOString();
        const updated = await deps.store.update(admin.id, key, {
          archivedAt: current.archivedAt ?? at,
          updatedAt: at,
        });

        recordMutation({
          actorId: admin.id,
          entityType: "jobApplication",
          entityKey: key,
          action: "archive",
          at,
        });

        return { ok: true, value: toSummary(updated) };
      } catch (error) {
        return asUnavailable(error);
      }
    },
  };
}

export type JobApplicationService = ReturnType<
  typeof createJobApplicationService
>;
