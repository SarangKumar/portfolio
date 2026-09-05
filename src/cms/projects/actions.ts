"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { requireAdminMutation } from "@/cms/projects/guard";
import { getProjectService } from "@/cms/projects/runtime";
import {
  readProjectWriteForm,
  validateProjectWriteInput,
} from "@/cms/projects/validation";
import type { MutationFailureCode, MutationFieldErrors } from "@/cms/result";
import type { ProjectFormState } from "@/cms/projects/form-state";

function withFormValues(
  formData: FormData,
  state: Omit<ProjectFormState, "values">,
): ProjectFormState {
  return {
    ...state,
    values: readProjectWriteForm(formData),
  };
}

function toFormState(
  formData: FormData,
  result: {
    ok: false;
    code: MutationFailureCode;
    fieldErrors?: MutationFieldErrors;
  },
): ProjectFormState {
  return withFormValues(formData, {
    status: "error",
    code: result.code,
    fieldErrors: result.fieldErrors,
  });
}

export async function createProjectAction(
  _previous: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  try {
    const auth = await requireAdminMutation();

    if (!auth.ok) {
      return withFormValues(formData, {
        status: "error",
        code: "unauthorized",
      });
    }

    const parsed = validateProjectWriteInput(readProjectWriteForm(formData));

    if (!parsed.ok) {
      return withFormValues(formData, {
        status: "error",
        code: "validation",
        fieldErrors: parsed.fieldErrors,
      });
    }

    const result = await getProjectService().create(auth.admin, parsed.value);

    if (!result.ok) {
      return toFormState(formData, result);
    }

    redirect(`/admin/projects/${result.value.key}`);
  } catch (error) {
    unstable_rethrow(error);
    return withFormValues(formData, {
      status: "error",
      code: "unavailable",
    });
  }
}

export async function updateProjectAction(
  _previous: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  try {
    const auth = await requireAdminMutation();

    if (!auth.ok) {
      return withFormValues(formData, {
        status: "error",
        code: "unauthorized",
      });
    }

    const keyValue = formData.get("key");
    const key = typeof keyValue === "string" ? keyValue : "";

    if (!key) {
      return withFormValues(formData, { status: "error", code: "notFound" });
    }

    const parsed = validateProjectWriteInput(readProjectWriteForm(formData));

    if (!parsed.ok) {
      return withFormValues(formData, {
        status: "error",
        code: "validation",
        fieldErrors: parsed.fieldErrors,
      });
    }

    const result = await getProjectService().update(
      auth.admin,
      key,
      parsed.value,
    );

    if (!result.ok) {
      return toFormState(formData, result);
    }

    return withFormValues(formData, { status: "saved" });
  } catch (error) {
    unstable_rethrow(error);
    return withFormValues(formData, {
      status: "error",
      code: "unavailable",
    });
  }
}

async function changeProjectStatus(
  formData: FormData,
  action: "publish" | "unpublish" | "archive",
) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return;
  }

  const keyValue = formData.get("key");
  const key = typeof keyValue === "string" ? keyValue : "";

  if (!key) {
    return;
  }

  const service = getProjectService();

  if (action === "publish") {
    await service.publish(auth.admin, key);
  } else if (action === "unpublish") {
    await service.unpublish(auth.admin, key);
  } else {
    await service.archive(auth.admin, key);
  }

  redirect(`/admin/projects/${key}`);
}

export async function publishProjectAction(formData: FormData) {
  try {
    await changeProjectStatus(formData, "publish");
  } catch (error) {
    unstable_rethrow(error);
  }
}

export async function unpublishProjectAction(formData: FormData) {
  try {
    await changeProjectStatus(formData, "unpublish");
  } catch (error) {
    unstable_rethrow(error);
  }
}

export async function archiveProjectAction(formData: FormData) {
  try {
    await changeProjectStatus(formData, "archive");
  } catch (error) {
    unstable_rethrow(error);
  }
}
