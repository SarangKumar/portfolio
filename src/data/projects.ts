import type { AppHref } from "@/types/routes";

export type ProjectItem = {
  id: string;
  title: string;
  summary: string;
  href: AppHref | null;
  experienceIds: readonly string[];
  skillIds: readonly string[];
};

export const projects: readonly ProjectItem[] = [];
