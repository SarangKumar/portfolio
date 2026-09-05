export class DuplicateSlugError extends Error {
  constructor() {
    super("A record with this slug already exists.");
    this.name = "DuplicateSlugError";
  }
}

export class ContentNotFoundError extends Error {
  constructor() {
    super("The requested content was not found.");
    this.name = "ContentNotFoundError";
  }
}

export function isUniqueConstraintError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return false;
  }

  return error.code === "P2002";
}
