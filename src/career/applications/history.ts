import type { JobApplicationStatus } from "@/career/applications/status";
import type { JobApplicationStatusHistoryRecord } from "@/career/applications/types";

export function createStatusHistoryKey(
  applicationKey: string,
  now: Date,
  sequence: number,
): string {
  return `${applicationKey}-hist-${now.getTime().toString(36)}-${sequence.toString(36)}`;
}

export function shouldSkipDuplicateTransition(
  currentStatus: JobApplicationStatus,
  newStatus: JobApplicationStatus,
): boolean {
  return currentStatus === newStatus;
}

export function shouldRecoverPendingTransition(
  latest: JobApplicationStatusHistoryRecord | undefined,
  currentStatus: JobApplicationStatus,
  newStatus: JobApplicationStatus,
): boolean {
  return Boolean(
    latest &&
    latest.previousStatus === currentStatus &&
    latest.newStatus === newStatus &&
    currentStatus !== newStatus,
  );
}

export function sortStatusHistoryNewestFirst(
  entries: readonly JobApplicationStatusHistoryRecord[],
): JobApplicationStatusHistoryRecord[] {
  return [...entries].sort((left, right) => {
    if (right.sequence !== left.sequence) {
      return right.sequence - left.sequence;
    }

    return right.changedAt.localeCompare(left.changedAt);
  });
}
