import type { AdminAccess } from "@/admin/authorize";
import { authorizeAdminMutation } from "@/cms/authorize";
import type { MutationResult } from "@/cms/result";
import type { JobApplicationService } from "@/career/applications/service";
import type {
  JobApplicationListPage,
  JobApplicationListQuery,
  JobApplicationRecord,
  JobApplicationStatusChangeExtras,
  JobApplicationStatusHistoryRecord,
  JobApplicationSummary,
  JobApplicationWriteInput,
} from "@/career/applications/types";
import type { JobApplicationStatus } from "@/career/applications/status";

const unauthorized = {
  ok: false as const,
  code: "unauthorized" as const,
};

export async function listJobApplications(
  access: AdminAccess,
  service: JobApplicationService,
  query: JobApplicationListQuery = {},
): Promise<MutationResult<JobApplicationListPage>> {
  const auth = authorizeAdminMutation(access);

  if (!auth.ok) {
    return unauthorized;
  }

  return service.list(auth.admin, query);
}

export async function getJobApplication(
  access: AdminAccess,
  service: JobApplicationService,
  key: string,
): Promise<MutationResult<JobApplicationRecord>> {
  const auth = authorizeAdminMutation(access);

  if (!auth.ok) {
    return unauthorized;
  }

  return service.get(auth.admin, key);
}

export async function createJobApplication(
  access: AdminAccess,
  service: JobApplicationService,
  input: JobApplicationWriteInput,
): Promise<MutationResult<JobApplicationRecord>> {
  const auth = authorizeAdminMutation(access);

  if (!auth.ok) {
    return unauthorized;
  }

  return service.create(auth.admin, input);
}

export async function updateJobApplication(
  access: AdminAccess,
  service: JobApplicationService,
  key: string,
  input: JobApplicationWriteInput,
): Promise<MutationResult<JobApplicationRecord>> {
  const auth = authorizeAdminMutation(access);

  if (!auth.ok) {
    return unauthorized;
  }

  return service.update(auth.admin, key, input);
}

export async function listJobApplicationStatusHistory(
  access: AdminAccess,
  service: JobApplicationService,
  key: string,
): Promise<MutationResult<readonly JobApplicationStatusHistoryRecord[]>> {
  const auth = authorizeAdminMutation(access);

  if (!auth.ok) {
    return unauthorized;
  }

  return service.listStatusHistory(auth.admin, key);
}

export async function archiveJobApplication(
  access: AdminAccess,
  service: JobApplicationService,
  key: string,
): Promise<MutationResult<JobApplicationSummary>> {
  const auth = authorizeAdminMutation(access);

  if (!auth.ok) {
    return unauthorized;
  }

  return service.archive(auth.admin, key);
}

export async function changeJobApplicationStatus(
  access: AdminAccess,
  service: JobApplicationService,
  key: string,
  status: JobApplicationStatus,
  extras: JobApplicationStatusChangeExtras = {},
): Promise<MutationResult<JobApplicationSummary>> {
  const auth = authorizeAdminMutation(access);

  if (!auth.ok) {
    return unauthorized;
  }

  return service.changeStatus(auth.admin, key, status, extras);
}
