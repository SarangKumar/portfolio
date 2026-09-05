import type { MutationFailureCode, MutationFieldErrors } from "@/cms/result";
import type { JobApplicationWriteFields } from "@/career/applications/validation";

export type JobApplicationFormState = {
  status: "idle" | "saved" | "error";
  code?: MutationFailureCode;
  fieldErrors?: MutationFieldErrors;
  values?: JobApplicationWriteFields;
};

export const initialJobApplicationFormState: JobApplicationFormState = {
  status: "idle",
};
