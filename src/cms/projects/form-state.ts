import type { MutationFailureCode, MutationFieldErrors } from "@/cms/result";
import type { ProjectFormFields } from "@/cms/projects/validation";

export type ProjectFormState = {
  status: "idle" | "saved" | "error";
  code?: MutationFailureCode;
  fieldErrors?: MutationFieldErrors;
  values?: ProjectFormFields;
};

export const initialProjectFormState: ProjectFormState = { status: "idle" };
