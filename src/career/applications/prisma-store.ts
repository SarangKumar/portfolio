import "server-only";

import { ContentNotFoundError } from "@/cms/errors";
import {
  createStatusHistoryKey,
  shouldRecoverPendingTransition,
  shouldSkipDuplicateTransition,
} from "@/career/applications/history";
import { runMongoTransaction } from "@/career/applications/mongo-transaction";
import {
  DEFAULT_APPLICATION_PAGE_SIZE,
  MAX_APPLICATION_PAGE_SIZE,
} from "@/career/applications/query";
import type { JobApplicationStore } from "@/career/applications/store";
import {
  isJobApplicationPriority,
  isJobApplicationStatus,
  isWorkMode,
  type JobApplicationPriority,
  type JobApplicationStatus,
  type WorkMode,
} from "@/career/applications/status";
import type {
  InterviewRoundRecord,
  JobApplicationListQuery,
  JobApplicationRecord,
  JobApplicationSortDirection,
  JobApplicationSortField,
  JobApplicationStatusChangePatch,
  JobApplicationStatusHistoryRecord,
  JobApplicationSummary,
} from "@/career/applications/types";
import type { Prisma, PrismaClient } from "@prisma/client";
import { getPrismaClient } from "@/db/client";
import { toDatabaseError } from "@/db/errors";

type DbClient = PrismaClient | Prisma.TransactionClient;

type InterviewRoundRow = {
  key: string;
  title: string;
  sortOrder: number;
  scheduledAt: Date | null;
};

type ApplicationRow = {
  id: string;
  key: string;
  ownerIdentityId: string;
  company: string;
  companyKey: string | null;
  role: string;
  jobUrl: string | null;
  location: string | null;
  workMode: string;
  jobDescription: string | null;
  salaryAmount: number | null;
  salaryCurrency: string | null;
  appliedAt: Date | null;
  status: string;
  source: string | null;
  referral: string | null;
  recruiter: string | null;
  resumeVersionKey: string | null;
  coverLetterKey: string | null;
  notes: string | null;
  priority: string;
  nextAction: string | null;
  nextActionAt: Date | null;
  rejectionReason: string | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  interviewRounds: InterviewRoundRow[];
};

type HistoryRow = {
  key: string;
  applicationKey: string;
  ownerIdentityId: string;
  sequence: number;
  previousStatus: string | null;
  newStatus: string;
  changedAt: Date;
  changedByIdentityId: string;
  reason: string | null;
  note: string | null;
};

const interviewInclude = {
  interviewRounds: { orderBy: { sortOrder: "asc" as const } },
};

function asStatus(value: string): JobApplicationStatus {
  if (isJobApplicationStatus(value)) {
    return value;
  }

  return "wishlist";
}

function asPriority(value: string): JobApplicationPriority {
  if (isJobApplicationPriority(value)) {
    return value;
  }

  return "medium";
}

function asWorkMode(value: string): WorkMode {
  if (isWorkMode(value)) {
    return value;
  }

  return "unspecified";
}

function asNullableStatus(value: string | null): JobApplicationStatus | null {
  if (value === null) {
    return null;
  }

  return asStatus(value);
}

function toInterview(row: InterviewRoundRow): InterviewRoundRecord {
  return {
    key: row.key,
    title: row.title,
    sortOrder: row.sortOrder,
    scheduledAt: row.scheduledAt ? row.scheduledAt.toISOString() : null,
  };
}

function toRecord(row: ApplicationRow): JobApplicationRecord {
  return {
    key: row.key,
    ownerIdentityId: row.ownerIdentityId,
    company: row.company,
    companyKey: row.companyKey,
    role: row.role,
    jobUrl: row.jobUrl,
    location: row.location,
    workMode: asWorkMode(row.workMode),
    jobDescription: row.jobDescription,
    salaryAmount: row.salaryAmount,
    salaryCurrency: row.salaryCurrency,
    appliedAt: row.appliedAt ? row.appliedAt.toISOString() : null,
    status: asStatus(row.status),
    source: row.source,
    referral: row.referral,
    recruiter: row.recruiter,
    resumeVersionKey: row.resumeVersionKey,
    coverLetterKey: row.coverLetterKey,
    notes: row.notes,
    priority: asPriority(row.priority),
    nextAction: row.nextAction,
    nextActionAt: row.nextActionAt ? row.nextActionAt.toISOString() : null,
    rejectionReason: row.rejectionReason,
    archivedAt: row.archivedAt ? row.archivedAt.toISOString() : null,
    interviewRounds: row.interviewRounds.map(toInterview),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toHistory(row: HistoryRow): JobApplicationStatusHistoryRecord {
  return {
    key: row.key,
    applicationKey: row.applicationKey,
    ownerIdentityId: row.ownerIdentityId,
    sequence: row.sequence,
    previousStatus: asNullableStatus(row.previousStatus),
    newStatus: asStatus(row.newStatus),
    changedAt: row.changedAt.toISOString(),
    changedByIdentityId: row.changedByIdentityId,
    reason: row.reason,
    note: row.note,
  };
}

function toSummary(row: {
  key: string;
  company: string;
  role: string;
  status: string;
  location: string | null;
  priority: string;
  nextAction: string | null;
  appliedAt: Date | null;
  nextActionAt: Date | null;
  archivedAt: Date | null;
  updatedAt: Date;
}): JobApplicationSummary {
  return {
    key: row.key,
    company: row.company,
    role: row.role,
    status: asStatus(row.status),
    location: row.location,
    priority: asPriority(row.priority),
    nextAction: row.nextAction,
    appliedAt: row.appliedAt ? row.appliedAt.toISOString() : null,
    nextActionAt: row.nextActionAt ? row.nextActionAt.toISOString() : null,
    archivedAt: row.archivedAt ? row.archivedAt.toISOString() : null,
    updatedAt: row.updatedAt.toISOString(),
  };
}

function wrap<T>(run: () => Promise<T>): Promise<T> {
  return run().catch((error: unknown) => {
    if (error instanceof ContentNotFoundError) {
      throw error;
    }

    throw toDatabaseError(error);
  });
}

function writeData(record: JobApplicationRecord) {
  return {
    key: record.key,
    ownerIdentityId: record.ownerIdentityId,
    company: record.company,
    companyKey: record.companyKey,
    role: record.role,
    jobUrl: record.jobUrl,
    location: record.location,
    workMode: record.workMode,
    jobDescription: record.jobDescription,
    salaryAmount: record.salaryAmount,
    salaryCurrency: record.salaryCurrency,
    appliedAt: record.appliedAt ? new Date(record.appliedAt) : null,
    status: record.status,
    source: record.source,
    referral: record.referral,
    recruiter: record.recruiter,
    resumeVersionKey: record.resumeVersionKey,
    coverLetterKey: record.coverLetterKey,
    notes: record.notes,
    priority: record.priority,
    nextAction: record.nextAction,
    nextActionAt: record.nextActionAt ? new Date(record.nextActionAt) : null,
    rejectionReason: record.rejectionReason,
    archivedAt: record.archivedAt ? new Date(record.archivedAt) : null,
  };
}

function containsInsensitive(value: string) {
  return { contains: value, mode: "insensitive" as const };
}

function listWhere(ownerIdentityId: string, query: JobApplicationListQuery) {
  const search = query.search?.trim();
  const company = query.company?.trim();
  const location = query.location?.trim();

  return {
    ownerIdentityId,
    ...(query.status ? { status: query.status } : {}),
    ...(query.priority ? { priority: query.priority } : {}),
    ...(query.includeArchived ? {} : { archivedAt: null }),
    ...(company ? { company: containsInsensitive(company) } : {}),
    ...(location ? { location: containsInsensitive(location) } : {}),
    ...(search
      ? {
          OR: [
            { company: containsInsensitive(search) },
            { role: containsInsensitive(search) },
            { recruiter: containsInsensitive(search) },
          ],
        }
      : {}),
    ...(query.appliedFrom || query.appliedTo
      ? {
          appliedAt: {
            ...(query.appliedFrom
              ? { gte: new Date(`${query.appliedFrom}T00:00:00.000Z`) }
              : {}),
            ...(query.appliedTo
              ? { lte: new Date(`${query.appliedTo}T23:59:59.999Z`) }
              : {}),
          },
        }
      : {}),
  };
}

function listOrderBy(
  sort: JobApplicationSortField,
  dir: JobApplicationSortDirection,
): Prisma.JobApplicationOrderByWithRelationInput[] {
  return [{ [sort]: dir }, { updatedAt: "desc" }];
}

async function findOwnedApplication(
  db: DbClient,
  ownerIdentityId: string,
  key: string,
) {
  return db.jobApplication.findFirst({
    where: { key, ownerIdentityId },
    include: interviewInclude,
  });
}

async function appendHistory(
  db: DbClient,
  input: {
    applicationId: string;
    applicationKey: string;
    ownerIdentityId: string;
    sequence: number;
    previousStatus: JobApplicationStatus | null;
    newStatus: JobApplicationStatus;
    changedAt: Date;
    changedByIdentityId: string;
    reason: string | null;
    note: string | null;
  },
) {
  await db.jobApplicationStatusHistory.create({
    data: {
      key: createStatusHistoryKey(
        input.applicationKey,
        input.changedAt,
        input.sequence,
      ),
      applicationId: input.applicationId,
      applicationKey: input.applicationKey,
      ownerIdentityId: input.ownerIdentityId,
      sequence: input.sequence,
      previousStatus: input.previousStatus,
      newStatus: input.newStatus,
      changedAt: input.changedAt,
      changedByIdentityId: input.changedByIdentityId,
      reason: input.reason,
      note: input.note,
    },
  });
}

export const prismaJobApplicationStore: JobApplicationStore = {
  list(ownerIdentityId, query: JobApplicationListQuery) {
    return wrap(async () => {
      const pageSize = Math.min(
        MAX_APPLICATION_PAGE_SIZE,
        Math.max(1, query.pageSize ?? DEFAULT_APPLICATION_PAGE_SIZE),
      );
      const page = Math.max(1, query.page ?? 1);
      const sort = query.sort ?? "appliedAt";
      const dir = query.dir ?? "desc";
      const where = listWhere(ownerIdentityId, query);
      const prisma = getPrismaClient();
      const [total, rows] = await Promise.all([
        prisma.jobApplication.count({ where }),
        prisma.jobApplication.findMany({
          where,
          orderBy: listOrderBy(sort, dir),
          skip: (page - 1) * pageSize,
          take: pageSize,
          select: {
            key: true,
            company: true,
            role: true,
            status: true,
            location: true,
            priority: true,
            nextAction: true,
            appliedAt: true,
            nextActionAt: true,
            archivedAt: true,
            updatedAt: true,
          },
        }),
      ]);

      return {
        items: rows.map(toSummary),
        total,
        page,
        pageSize,
      };
    });
  },

  getByKey(ownerIdentityId, key) {
    return wrap(async () => {
      const row = await findOwnedApplication(
        getPrismaClient(),
        ownerIdentityId,
        key,
      );

      return row ? toRecord(row) : null;
    });
  },

  listStatusHistory(ownerIdentityId, key) {
    return wrap(async () => {
      const prisma = getPrismaClient();
      const current = await prisma.jobApplication.findFirst({
        where: { key, ownerIdentityId },
        select: { key: true },
      });

      if (!current) {
        return null;
      }

      const rows = await prisma.jobApplicationStatusHistory.findMany({
        where: { applicationKey: key, ownerIdentityId },
        orderBy: [{ sequence: "desc" }, { changedAt: "desc" }],
      });

      return rows.map(toHistory);
    });
  },

  create(record) {
    return wrap(async () => {
      const prisma = getPrismaClient();

      return runMongoTransaction(prisma, async (tx) => {
        const row = await tx.jobApplication.create({
          data: writeData(record),
          include: interviewInclude,
        });
        await appendHistory(tx, {
          applicationId: row.id,
          applicationKey: record.key,
          ownerIdentityId: record.ownerIdentityId,
          sequence: 1,
          previousStatus: null,
          newStatus: record.status,
          changedAt: new Date(record.createdAt),
          changedByIdentityId: record.ownerIdentityId,
          reason: null,
          note: null,
        });
        return toRecord(row);
      });
    });
  },

  update(ownerIdentityId, key, patch) {
    return wrap(async () => {
      const current = await findOwnedApplication(
        getPrismaClient(),
        ownerIdentityId,
        key,
      );

      if (!current) {
        throw new ContentNotFoundError();
      }

      const merged = { ...toRecord(current), ...patch };
      const row = await getPrismaClient().jobApplication.update({
        where: { key },
        data: writeData(merged),
        include: interviewInclude,
      });
      return toRecord(row);
    });
  },

  applyStatusChange(
    ownerIdentityId,
    key,
    patch: JobApplicationStatusChangePatch,
  ) {
    return wrap(async () => {
      const prisma = getPrismaClient();

      return runMongoTransaction(prisma, async (tx) => {
        const current = await findOwnedApplication(tx, ownerIdentityId, key);

        if (!current) {
          throw new ContentNotFoundError();
        }

        const currentStatus = asStatus(current.status);

        if (shouldSkipDuplicateTransition(currentStatus, patch.newStatus)) {
          return toRecord(current);
        }

        const latest = await tx.jobApplicationStatusHistory.findFirst({
          where: { applicationKey: key, ownerIdentityId },
          orderBy: [{ sequence: "desc" }, { changedAt: "desc" }],
        });
        const recover = shouldRecoverPendingTransition(
          latest ? toHistory(latest) : undefined,
          currentStatus,
          patch.newStatus,
        );

        if (!recover) {
          const count = await tx.jobApplicationStatusHistory.count({
            where: { applicationKey: key },
          });
          await appendHistory(tx, {
            applicationId: current.id,
            applicationKey: key,
            ownerIdentityId,
            sequence: count + 1,
            previousStatus: currentStatus,
            newStatus: patch.newStatus,
            changedAt: new Date(patch.changedAt),
            changedByIdentityId: patch.changedByIdentityId,
            reason: patch.reason,
            note: patch.note,
          });
        }

        const row = await tx.jobApplication.update({
          where: { key },
          data: {
            status: patch.newStatus,
            ...(patch.newStatus === "rejected" &&
            patch.rejectionReason !== undefined
              ? { rejectionReason: patch.rejectionReason }
              : {}),
          },
          include: interviewInclude,
        });

        return toRecord(row);
      });
    });
  },
};
