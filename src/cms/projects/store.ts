import type {
  AdminProjectRecord,
  AdminProjectSummary,
} from "@/cms/projects/types";

export type ProjectStore = {
  list(): Promise<readonly AdminProjectSummary[]>;
  getByKey(key: string): Promise<AdminProjectRecord | null>;
  getBySlug(slug: string): Promise<AdminProjectRecord | null>;
  create(record: AdminProjectRecord): Promise<AdminProjectRecord>;
  update(
    key: string,
    patch: Partial<AdminProjectRecord>,
  ): Promise<AdminProjectRecord>;
};
