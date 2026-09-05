"use client";

import { useActionState } from "react";
import {
  createJobApplicationAction,
  updateJobApplicationAction,
} from "@/career/applications/actions";
import {
  initialJobApplicationFormState,
  type JobApplicationFormState,
} from "@/career/applications/form-state";
import type { JobApplicationRecord } from "@/career/applications/types";
import { jobApplicationToFormFields } from "@/career/applications/validation";
import {
  ApplicationFormFields,
  ApplicationFormSubmit,
} from "@/features/admin/applications/application-form-fields";
import type { ApplicationFormCopy } from "@/features/admin/applications/application-form-copy";

type ApplicationFormProps = {
  mode: "create" | "edit";
  copy: ApplicationFormCopy;
  application?: JobApplicationRecord;
};

export function ApplicationForm({
  mode,
  copy,
  application,
}: ApplicationFormProps) {
  const action =
    mode === "create" ? createJobApplicationAction : updateJobApplicationAction;
  const [state, formAction, pending] = useActionState(
    action,
    initialJobApplicationFormState,
  );
  const values = {
    ...jobApplicationToFormFields(application),
    ...state.values,
  };

  return (
    <form
      action={formAction}
      className="stack-section max-w-3xl"
      noValidate
      aria-busy={pending}
      key={state.values ? "submitted" : "pristine"}
    >
      {mode === "edit" && application ? (
        <input type="hidden" name="key" value={application.key} />
      ) : null}

      <ApplicationFormFields
        values={values}
        fieldErrors={state.fieldErrors}
        pending={pending}
        copy={copy}
      />

      <div className="flex flex-wrap items-center gap-2">
        <ApplicationFormSubmit pending={pending} copy={copy} />
        <FormStatus state={state} copy={copy} />
      </div>
    </form>
  );
}

function FormStatus({
  state,
  copy,
}: {
  state: JobApplicationFormState;
  copy: ApplicationFormCopy;
}) {
  if (state.status === "saved") {
    return (
      <p role="status" className="type-small text-success">
        {copy.saved}
      </p>
    );
  }

  if (state.status !== "error" || state.fieldErrors) {
    return null;
  }

  const message =
    state.code === "unauthorized"
      ? copy.errors.unauthorized
      : state.code === "notFound"
        ? copy.errors.notFound
        : copy.errors.unavailable;

  return (
    <p role="alert" className="type-small text-destructive">
      {message}
    </p>
  );
}
