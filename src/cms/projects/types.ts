import type { PersistedProject } from "@/content/records";
import type { PublicationStatus } from "@/content/status";

export type AdminProjectSummary = {
  key: string;
  slug: string;
  title: string;
  status: PublicationStatus;
  updatedAt: string;
};

export type AdminProjectRecord = PersistedProject & {
  publishedAt: string | null;
  updatedAt: string;
};

export type ProjectWriteInput = {
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  technologies: readonly string[];
  skillKeys: readonly string[];
  githubUrl: string | null;
  demoUrl: string | null;
  internalNotes: string | null;
};
