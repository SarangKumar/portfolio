import { isPublicSlug } from "@/lib/slug";
import { publicationStatuses, type PublicationStatus } from "@/content/status";
import type { MutationFieldErrors } from "@/cms/result";
import type { ProjectWriteInput } from "@/cms/projects/types";

export const PROJECT_LIMITS = {
  title: 120,
  slug: 80,
  summary: 280,
  description: 8000,
  url: 2048,
  listItem: 64,
  listCount: 32,
  internalNotes: 4000,
} as const;

export type ProjectField =
  | "title"
  | "slug"
  | "summary"
  | "description"
  | "technologies"
  | "skillKeys"
  | "githubUrl"
  | "demoUrl"
  | "internalNotes";

function trim(value: string): string {
  return value.trim();
}

function emptyToNull(value: string): string | null {
  const next = trim(value);
  return next.length > 0 ? next : null;
}

export function parseStringList(value: string): string[] {
  const seen = new Set<string>();
  const items: string[] = [];

  for (const part of value.split(/[\n,]+/)) {
    const item = part.trim();

    if (!item || seen.has(item)) {
      continue;
    }

    seen.add(item);
    items.push(item);
  }

  return items;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateOptionalUrl(
  value: string,
  field: ProjectField,
  fieldErrors: MutationFieldErrors,
): string | null {
  const next = emptyToNull(value);

  if (!next) {
    return null;
  }

  if (next.length > PROJECT_LIMITS.url || !isHttpUrl(next)) {
    fieldErrors[field] = "invalidUrl";
    return null;
  }

  return next;
}

function validateList(
  items: readonly string[],
  field: ProjectField,
  fieldErrors: MutationFieldErrors,
): string[] {
  if (items.length > PROJECT_LIMITS.listCount) {
    fieldErrors[field] = "tooMany";
    return [...items];
  }

  if (items.some((item) => item.length > PROJECT_LIMITS.listItem)) {
    fieldErrors[field] = "tooLong";
  }

  if (field === "skillKeys" && items.some((item) => !isPublicSlug(item))) {
    fieldErrors[field] = "invalidSlug";
  }

  return [...items];
}

export type ProjectFormFields = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  technologies: string;
  skillKeys: string;
  githubUrl: string;
  demoUrl: string;
  internalNotes: string;
};

export function emptyProjectFormFields(): ProjectFormFields {
  return {
    title: "",
    slug: "",
    summary: "",
    description: "",
    technologies: "",
    skillKeys: "",
    githubUrl: "",
    demoUrl: "",
    internalNotes: "",
  };
}

export function projectRecordToFormFields(
  project?: {
    title: string;
    slug: string;
    summary: string;
    description: string | null;
    technologies: readonly string[];
    skillKeys: readonly string[];
    githubUrl: string | null;
    demoUrl: string | null;
    internalNotes: string | null;
  } | null,
): ProjectFormFields {
  if (!project) {
    return emptyProjectFormFields();
  }

  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description ?? "",
    technologies: project.technologies.join(", "),
    skillKeys: project.skillKeys.join(", "),
    githubUrl: project.githubUrl ?? "",
    demoUrl: project.demoUrl ?? "",
    internalNotes: project.internalNotes ?? "",
  };
}

export function readProjectWriteForm(formData: FormData): ProjectFormFields {
  const read = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };

  return {
    title: read("title"),
    slug: read("slug"),
    summary: read("summary"),
    description: read("description"),
    technologies: read("technologies"),
    skillKeys: read("skillKeys"),
    githubUrl: read("githubUrl"),
    demoUrl: read("demoUrl"),
    internalNotes: read("internalNotes"),
  };
}

export type ProjectWriteValidation =
  | { ok: true; value: ProjectWriteInput }
  | { ok: false; fieldErrors: MutationFieldErrors };

export function validateProjectWriteInput(input: {
  title: string;
  slug: string;
  summary: string;
  description: string;
  technologies: string;
  skillKeys: string;
  githubUrl: string;
  demoUrl: string;
  internalNotes: string;
}): ProjectWriteValidation {
  const fieldErrors: MutationFieldErrors = {};
  const title = trim(input.title);
  const slug = trim(input.slug).toLowerCase();
  const summary = trim(input.summary);
  const description = emptyToNull(input.description);
  const internalNotes = emptyToNull(input.internalNotes);
  const technologies = parseStringList(input.technologies);
  const skillKeys = parseStringList(input.skillKeys);

  if (!title) {
    fieldErrors.title = "required";
  } else if (title.length > PROJECT_LIMITS.title) {
    fieldErrors.title = "tooLong";
  }

  if (!slug) {
    fieldErrors.slug = "required";
  } else if (slug.length > PROJECT_LIMITS.slug || !isPublicSlug(slug)) {
    fieldErrors.slug = "invalidSlug";
  }

  if (!summary) {
    fieldErrors.summary = "required";
  } else if (summary.length > PROJECT_LIMITS.summary) {
    fieldErrors.summary = "tooLong";
  }

  if (description && description.length > PROJECT_LIMITS.description) {
    fieldErrors.description = "tooLong";
  }

  if (internalNotes && internalNotes.length > PROJECT_LIMITS.internalNotes) {
    fieldErrors.internalNotes = "tooLong";
  }

  validateList(technologies, "technologies", fieldErrors);
  validateList(skillKeys, "skillKeys", fieldErrors);
  const githubUrl = validateOptionalUrl(
    input.githubUrl,
    "githubUrl",
    fieldErrors,
  );
  const demoUrl = validateOptionalUrl(input.demoUrl, "demoUrl", fieldErrors);

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: {
      title,
      slug,
      summary,
      description,
      technologies,
      skillKeys,
      githubUrl,
      demoUrl,
      internalNotes,
    },
  };
}

export function isPublicationStatus(value: string): value is PublicationStatus {
  return publicationStatuses.includes(value as PublicationStatus);
}
