import type { AdminAccess } from "@/admin/authorize";
import { authorizeAdminMutation } from "@/cms/authorize";
import type { MutationFailureCode, MutationFieldErrors } from "@/cms/result";
import {
  createJobApplication,
  updateJobApplication,
} from "@/career/applications/access";
import type { JobApplicationFormState } from "@/career/applications/form-state";
import type { JobApplicationService } from "@/career/applications/service";
import {
  readJobApplicationWriteForm,
  validateJobApplicationWriteInput,
} from "@/career/applications/validation";

export type { JobApplicationFormState };

export type PersistJobApplicationResult =
  { ok: true; key: string } | { ok: false; state: JobApplicationFormState };

function toFormState(result: {
  ok: false;
  code: MutationFailureCode;
  fieldErrors?: MutationFieldErrors;
}): JobApplicationFormState {
  return {
    status: "error",
    code: result.code,
    fieldErrors: result.fieldErrors,
  };
}

export async function persistJobApplicationWrite(input: {
  access: AdminAccess;
  service: JobApplicationService;
  formData: FormData;
  mode: "create" | "update";
}): Promise<PersistJobApplicationResult> {
  const auth = authorizeAdminMutation(input.access);

  if (!auth.ok) {
    return { ok: false, state: { status: "error", code: "unauthorized" } };
  }

  const parsed = validateJobApplicationWriteInput(
    readJobApplicationWriteForm(input.formData),
  );

  if (!parsed.ok) {
    return {
      ok: false,
      state: {
        status: "error",
        code: "validation",
        fieldErrors: parsed.fieldErrors,
      },
    };
  }

  try {
    if (input.mode === "create") {
      const created = await createJobApplication(
        input.access,
        input.service,
        parsed.value,
      );

      if (!created.ok) {
        return { ok: false, state: toFormState(created) };
      }

      return { ok: true, key: created.value.key };
    }

    const keyValue = input.formData.get("key");
    const key = typeof keyValue === "string" ? keyValue.trim() : "";

    if (!key) {
      return { ok: false, state: { status: "error", code: "notFound" } };
    }

    const updated = await updateJobApplication(
      input.access,
      input.service,
      key,
      parsed.value,
    );

    if (!updated.ok) {
      return { ok: false, state: toFormState(updated) };
    }

    return { ok: true, key: updated.value.key };
  } catch {
    return { ok: false, state: { status: "error", code: "unavailable" } };
  }
}
