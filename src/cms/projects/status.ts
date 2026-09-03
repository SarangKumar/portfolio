import type { PublicationStatus } from "@/content/status";

/** Archive is a soft delete: the row stays, public queries ignore it. */

export function publishedProjectStatus(): PublicationStatus {
  return "published";
}

export function unpublishedProjectStatus(): PublicationStatus {
  return "draft";
}

export function archivedProjectStatus(): PublicationStatus {
  return "archived";
}
