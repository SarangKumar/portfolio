import type {
  JobApplicationListQuery,
  JobApplicationRecord,
  JobApplicationSummary,
} from "@/career/applications/types";

export type JobApplicationStore = {
  list(
    ownerIdentityId: string,
    query: JobApplicationListQuery,
  ): Promise<readonly JobApplicationSummary[]>;
  getByKey(
    ownerIdentityId: string,
    key: string,
  ): Promise<JobApplicationRecord | null>;
  create(record: JobApplicationRecord): Promise<JobApplicationRecord>;
  update(
    ownerIdentityId: string,
    key: string,
    patch: Partial<JobApplicationRecord>,
  ): Promise<JobApplicationRecord>;
};
