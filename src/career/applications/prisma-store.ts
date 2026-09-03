import "server-only";

import { ContentNotFoundError } from "@/cms/errors";
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
  JobApplicationSummary,
} from "@/career/applications/types";
import { getPrismaClient } from "@/db/client";
import { toDatabaseError } from "@/db/errors";

type InterviewRoundRow = {
  key: string;
  title: string;
  sortOrder: number;
  scheduledAt: Date | null;
};

type ApplicationRow = {
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

function toSummary(row: {
  key: string;
  company: string;
  role: string;
  status: string;
  priority: string;
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
    priority: asPriority(row.priority),
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

export const prismaJobApplicationStore: JobApplicationStore = {
  list(ownerIdentityId, query: JobApplicationListQuery) {
    return wrap(async () => {
      const rows = await getPrismaClient().jobApplication.findMany({
        where: {
          ownerIdentityId,
          ...(query.status ? { status: query.status } : {}),
          ...(query.priority ? { priority: query.priority } : {}),
          ...(query.includeArchived ? {} : { archivedAt: null }),
        },
        orderBy: [{ appliedAt: "desc" }, { updatedAt: "desc" }],
        select: {
          key: true,
          company: true,
          role: true,
          status: true,
          priority: true,
          appliedAt: true,
          nextActionAt: true,
          archivedAt: true,
          updatedAt: true,
        },
      });

      return rows.map(toSummary);
    });
  },

  getByKey(ownerIdentityId, key) {
    return wrap(async () => {
      const row = await getPrismaClient().jobApplication.findFirst({
        where: { key, ownerIdentityId },
        include: { interviewRounds: { orderBy: { sortOrder: "asc" } } },
      });

      return row ? toRecord(row) : null;
    });
  },

  create(record) {
    return wrap(async () => {
      const row = await getPrismaClient().jobApplication.create({
        data: writeData(record),
        include: { interviewRounds: { orderBy: { sortOrder: "asc" } } },
      });
      return toRecord(row);
    });
  },

  update(ownerIdentityId, key, patch) {
    return wrap(async () => {
      const current = await getPrismaClient().jobApplication.findFirst({
        where: { key, ownerIdentityId },
        include: { interviewRounds: { orderBy: { sortOrder: "asc" } } },
      });

      if (!current) {
        throw new ContentNotFoundError();
      }

      const merged = { ...toRecord(current), ...patch };
      const row = await getPrismaClient().jobApplication.update({
        where: { key },
        data: writeData(merged),
        include: { interviewRounds: { orderBy: { sortOrder: "asc" } } },
      });
      return toRecord(row);
    });
  },
};
