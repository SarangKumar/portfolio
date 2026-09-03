export const publicationStatuses = ["draft", "published", "archived"] as const;

export type PublicationStatus = (typeof publicationStatuses)[number];

export const PUBLICATION_STATUS_PUBLISHED =
  "published" satisfies PublicationStatus;

export function isPublishedStatus(status: string): status is PublicationStatus {
  return status === PUBLICATION_STATUS_PUBLISHED;
}
