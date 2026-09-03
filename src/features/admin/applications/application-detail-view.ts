import type { MutationResult } from "@/cms/result";
import type { JobApplicationRecord } from "@/career/applications/types";

export type ApplicationDetailViewState =
  | { kind: "denied" }
  | { kind: "notFound" }
  | { kind: "unavailable" }
  | { kind: "ready"; record: JobApplicationRecord };

export function resolveApplicationDetailView(input: {
  authorized: boolean;
  result: MutationResult<JobApplicationRecord> | null;
}): ApplicationDetailViewState {
  if (!input.authorized) {
    return { kind: "denied" };
  }

  if (!input.result) {
    return { kind: "notFound" };
  }

  if (input.result.ok) {
    return { kind: "ready", record: input.result.value };
  }

  if (input.result.code === "unauthorized") {
    return { kind: "denied" };
  }

  if (input.result.code === "unavailable") {
    return { kind: "unavailable" };
  }

  return { kind: "notFound" };
}
