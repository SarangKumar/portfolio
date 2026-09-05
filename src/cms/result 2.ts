export type MutationFieldErrors = Record<string, string>;

export type MutationFailureCode =
  "unauthorized" | "validation" | "notFound" | "duplicateSlug" | "unavailable";

export type MutationResult<T> =
  | { ok: true; value: T }
  | {
      ok: false;
      code: MutationFailureCode;
      fieldErrors?: MutationFieldErrors;
    };
