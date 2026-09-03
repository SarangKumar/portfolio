"use client";

import { useActionState } from "react";
import {
  createProjectAction,
  initialProjectFormState,
  updateProjectAction,
  type ProjectFormState,
} from "@/cms/projects/actions";
import { PROJECT_LIMITS } from "@/cms/projects/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminField } from "@/features/admin/admin-field";
import type { AdminProjectRecord } from "@/cms/projects/types";

export type ProjectFormCopy = {
  title: string;
  slug: string;
  slugHint: string;
  summary: string;
  description: string;
  technologies: string;
  technologiesHint: string;
  skillKeys: string;
  skillKeysHint: string;
  githubUrl: string;
  demoUrl: string;
  internalNotes: string;
  internalNotesHint: string;
  save: string;
  saving: string;
  saved: string;
  required: string;
  tooLong: string;
  tooMany: string;
  invalidSlug: string;
  invalidUrl: string;
  duplicateSlug: string;
  unauthorized: string;
  unavailable: string;
  notFound: string;
};

type ProjectFormProps = {
  mode: "create" | "edit";
  copy: ProjectFormCopy;
  project?: AdminProjectRecord;
};

function fieldMessage(
  code: string | undefined,
  copy: ProjectFormCopy,
): string | undefined {
  if (code === "required") {
    return copy.required;
  }

  if (code === "tooLong") {
    return copy.tooLong;
  }

  if (code === "tooMany") {
    return copy.tooMany;
  }

  if (code === "invalidSlug") {
    return copy.invalidSlug;
  }

  if (code === "invalidUrl") {
    return copy.invalidUrl;
  }

  if (code === "duplicate") {
    return copy.duplicateSlug;
  }

  return undefined;
}

function describedBy(id: string, error?: string, hint?: boolean) {
  if (error) {
    return `${id}-error`;
  }

  if (hint) {
    return `${id}-hint`;
  }

  return undefined;
}

export function ProjectForm({ mode, copy, project }: ProjectFormProps) {
  const action = mode === "create" ? createProjectAction : updateProjectAction;
  const [state, formAction, pending] = useActionState(
    action,
    initialProjectFormState,
  );

  return (
    <form action={formAction} className="stack-section max-w-xl" noValidate>
      {mode === "edit" && project ? (
        <input type="hidden" name="key" value={project.key} />
      ) : null}

      <AdminField
        id="project-title"
        label={copy.title}
        error={fieldMessage(state.fieldErrors?.title, copy)}
      >
        <Input
          id="project-title"
          name="title"
          maxLength={PROJECT_LIMITS.title}
          required
          disabled={pending}
          defaultValue={project?.title}
          aria-invalid={Boolean(state.fieldErrors?.title)}
          aria-describedby={describedBy(
            "project-title",
            state.fieldErrors?.title,
          )}
        />
      </AdminField>

      <AdminField
        id="project-slug"
        label={copy.slug}
        hint={copy.slugHint}
        error={fieldMessage(state.fieldErrors?.slug, copy)}
      >
        <Input
          id="project-slug"
          name="slug"
          maxLength={PROJECT_LIMITS.slug}
          required
          disabled={pending}
          defaultValue={project?.slug}
          aria-invalid={Boolean(state.fieldErrors?.slug)}
          aria-describedby={describedBy(
            "project-slug",
            state.fieldErrors?.slug,
            true,
          )}
        />
      </AdminField>

      <AdminField
        id="project-summary"
        label={copy.summary}
        error={fieldMessage(state.fieldErrors?.summary, copy)}
      >
        <Textarea
          id="project-summary"
          name="summary"
          maxLength={PROJECT_LIMITS.summary}
          required
          disabled={pending}
          defaultValue={project?.summary}
          aria-invalid={Boolean(state.fieldErrors?.summary)}
          aria-describedby={describedBy(
            "project-summary",
            state.fieldErrors?.summary,
          )}
        />
      </AdminField>

      <AdminField
        id="project-description"
        label={copy.description}
        error={fieldMessage(state.fieldErrors?.description, copy)}
      >
        <Textarea
          id="project-description"
          name="description"
          maxLength={PROJECT_LIMITS.description}
          disabled={pending}
          defaultValue={project?.description ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.description)}
          aria-describedby={describedBy(
            "project-description",
            state.fieldErrors?.description,
          )}
        />
      </AdminField>

      <AdminField
        id="project-technologies"
        label={copy.technologies}
        hint={copy.technologiesHint}
        error={fieldMessage(state.fieldErrors?.technologies, copy)}
      >
        <Input
          id="project-technologies"
          name="technologies"
          disabled={pending}
          defaultValue={project?.technologies.join(", ")}
          aria-invalid={Boolean(state.fieldErrors?.technologies)}
          aria-describedby={describedBy(
            "project-technologies",
            state.fieldErrors?.technologies,
            true,
          )}
        />
      </AdminField>

      <AdminField
        id="project-skill-keys"
        label={copy.skillKeys}
        hint={copy.skillKeysHint}
        error={fieldMessage(state.fieldErrors?.skillKeys, copy)}
      >
        <Input
          id="project-skill-keys"
          name="skillKeys"
          disabled={pending}
          defaultValue={project?.skillKeys.join(", ")}
          aria-invalid={Boolean(state.fieldErrors?.skillKeys)}
          aria-describedby={describedBy(
            "project-skill-keys",
            state.fieldErrors?.skillKeys,
            true,
          )}
        />
      </AdminField>

      <AdminField
        id="project-github"
        label={copy.githubUrl}
        error={fieldMessage(state.fieldErrors?.githubUrl, copy)}
      >
        <Input
          id="project-github"
          name="githubUrl"
          type="url"
          disabled={pending}
          defaultValue={project?.githubUrl ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.githubUrl)}
          aria-describedby={describedBy(
            "project-github",
            state.fieldErrors?.githubUrl,
          )}
        />
      </AdminField>

      <AdminField
        id="project-demo"
        label={copy.demoUrl}
        error={fieldMessage(state.fieldErrors?.demoUrl, copy)}
      >
        <Input
          id="project-demo"
          name="demoUrl"
          type="url"
          disabled={pending}
          defaultValue={project?.demoUrl ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.demoUrl)}
          aria-describedby={describedBy(
            "project-demo",
            state.fieldErrors?.demoUrl,
          )}
        />
      </AdminField>

      <AdminField
        id="project-notes"
        label={copy.internalNotes}
        hint={copy.internalNotesHint}
        error={fieldMessage(state.fieldErrors?.internalNotes, copy)}
      >
        <Textarea
          id="project-notes"
          name="internalNotes"
          maxLength={PROJECT_LIMITS.internalNotes}
          disabled={pending}
          defaultValue={project?.internalNotes ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.internalNotes)}
          aria-describedby={describedBy(
            "project-notes",
            state.fieldErrors?.internalNotes,
            true,
          )}
        />
      </AdminField>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? copy.saving : copy.save}
        </Button>
        <FormStatus state={state} copy={copy} />
      </div>
    </form>
  );
}

function FormStatus({
  state,
  copy,
}: {
  state: ProjectFormState;
  copy: ProjectFormCopy;
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
      ? copy.unauthorized
      : state.code === "notFound"
        ? copy.notFound
        : state.code === "duplicateSlug"
          ? copy.duplicateSlug
          : copy.unavailable;

  return (
    <p role="alert" className="type-small text-destructive">
      {message}
    </p>
  );
}
