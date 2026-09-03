import type { MutationFailureCode, MutationFieldErrors } from "@/cms/result";

export type JobApplicationFormState = {
  status: "idle" | "saved" | "error";
  code?: MutationFailureCode;
  fieldErrors?: MutationFieldErrors;
};

export const initialJobApplicationFormState: JobApplicationFormState = {
  status: "idle",
};
