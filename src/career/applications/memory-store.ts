import { ContentNotFoundError } from "@/cms/errors";
import {
  createStatusHistoryKey,
  shouldRecoverPendingTransition,
  shouldSkipDuplicateTransition,
  sortStatusHistoryNewestFirst,
} from "@/career/applications/history";
import { paginateJobApplicationRecords } from "@/career/applications/query";
import type { JobApplicationStore } from "@/career/applications/store";
import type {
  JobApplicationRecord,
  JobApplicationStatusHistoryRecord,
} from "@/career/applications/types";
import { DatabaseError } from "@/db/errors";

export type MemoryJobApplicationStoreOptions = {
  failCreateHistory?: boolean;
  failHistoryAppend?: boolean;
  failStatusWriteAfterHistory?: boolean;
};

function cloneRecord(record: JobApplicationRecord): JobApplicationRecord {
  return {
    ...record,
    interviewRounds: [...record.interviewRounds],
  };
}

function cloneHistory(
  entry: JobApplicationStatusHistoryRecord,
): JobApplicationStatusHistoryRecord {
  return { ...entry };
}

function initialHistory(
  record: JobApplicationRecord,
): JobApplicationStatusHistoryRecord {
  return {
    key: createStatusHistoryKey(record.key, new Date(record.createdAt), 1),
    applicationKey: record.key,
    ownerIdentityId: record.ownerIdentityId,
    sequence: 1,
    previousStatus: null,
    newStatus: record.status,
    changedAt: record.createdAt,
    changedByIdentityId: record.ownerIdentityId,
    reason: null,
    note: null,
  };
}

export function createMemoryJobApplicationStore(
  seed: JobApplicationRecord[] = [],
  options: MemoryJobApplicationStoreOptions = {},
): JobApplicationStore {
  const records = new Map(seed.map((item) => [item.key, cloneRecord(item)]));
  const history = new Map<string, JobApplicationStatusHistoryRecord[]>(
    seed.map((item) => [item.key, [cloneHistory(initialHistory(item))]]),
  );

  function ownedRecord(
    ownerIdentityId: string,
    key: string,
  ): JobApplicationRecord | undefined {
    const record = records.get(key);

    if (!record || record.ownerIdentityId !== ownerIdentityId) {
      return undefined;
    }

    return record;
  }

  function historyFor(key: string): JobApplicationStatusHistoryRecord[] {
    return history.get(key) ?? [];
  }

  return {
    async list(ownerIdentityId, query) {
      return paginateJobApplicationRecords(
        [...records.values()].filter(
          (item) => item.ownerIdentityId === ownerIdentityId,
        ),
        query,
      );
    },
    async getByKey(ownerIdentityId, key) {
      const record = ownedRecord(ownerIdentityId, key);
      return record ? cloneRecord(record) : null;
    },
    async listStatusHistory(ownerIdentityId, key) {
      if (!ownedRecord(ownerIdentityId, key)) {
        return null;
      }

      return sortStatusHistoryNewestFirst(historyFor(key)).map(cloneHistory);
    },
    async create(next) {
      if (options.failCreateHistory) {
        throw new DatabaseError("Failed to append status history.");
      }

      records.set(next.key, cloneRecord(next));
      history.set(next.key, [cloneHistory(initialHistory(next))]);
      return cloneRecord(next);
    },
    async update(ownerIdentityId, key, patch) {
      const current = ownedRecord(ownerIdentityId, key);

      if (!current) {
        throw new ContentNotFoundError();
      }

      const next = { ...current, ...patch };
      records.set(key, next);
      return cloneRecord(next);
    },
    async applyStatusChange(ownerIdentityId, key, patch) {
      const current = ownedRecord(ownerIdentityId, key);

      if (!current) {
        throw new ContentNotFoundError();
      }

      if (shouldSkipDuplicateTransition(current.status, patch.newStatus)) {
        return cloneRecord(current);
      }

      const entries = historyFor(key);
      const latest = sortStatusHistoryNewestFirst(entries)[0];
      const recover = shouldRecoverPendingTransition(
        latest,
        current.status,
        patch.newStatus,
      );

      if (!recover) {
        if (options.failHistoryAppend) {
          throw new DatabaseError("Failed to append status history.");
        }

        const sequence = entries.length + 1;
        entries.push({
          key: createStatusHistoryKey(key, new Date(patch.changedAt), sequence),
          applicationKey: key,
          ownerIdentityId,
          sequence,
          previousStatus: current.status,
          newStatus: patch.newStatus,
          changedAt: patch.changedAt,
          changedByIdentityId: patch.changedByIdentityId,
          reason: patch.reason,
          note: patch.note,
        });
        history.set(key, entries);
      }

      if (options.failStatusWriteAfterHistory) {
        throw new DatabaseError("Failed to update application status.");
      }

      const next: JobApplicationRecord = {
        ...current,
        status: patch.newStatus,
        updatedAt: patch.changedAt,
        rejectionReason:
          patch.newStatus === "rejected" && patch.rejectionReason !== undefined
            ? patch.rejectionReason
            : current.rejectionReason,
      };
      records.set(key, next);
      return cloneRecord(next);
    },
  };
}
