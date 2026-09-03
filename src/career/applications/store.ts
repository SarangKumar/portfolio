import type {
  JobApplicationListPage,
  JobApplicationListQuery,
  JobApplicationRecord,
  JobApplicationStatusChangePatch,
  JobApplicationStatusHistoryRecord,
} from "@/career/applications/types";

export type JobApplicationStore = {
  list(
    ownerIdentityId: string,
    query: JobApplicationListQuery,
  ): Promise<JobApplicationListPage>;
  getByKey(
    ownerIdentityId: string,
    key: string,
  ): Promise<JobApplicationRecord | null>;
  listStatusHistory(
    ownerIdentityId: string,
    key: string,
  ): Promise<readonly JobApplicationStatusHistoryRecord[] | null>;
  create(record: JobApplicationRecord): Promise<JobApplicationRecord>;
  update(
    ownerIdentityId: string,
    key: string,
    patch: Partial<JobApplicationRecord>,
  ): Promise<JobApplicationRecord>;
  applyStatusChange(
    ownerIdentityId: string,
    key: string,
    patch: JobApplicationStatusChangePatch,
  ): Promise<JobApplicationRecord>;
};
