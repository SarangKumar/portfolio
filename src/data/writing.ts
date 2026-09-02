import type { AppHref } from "@/types/routes";

export type WritingItem = {
  id: string;
  title: string;
  summary: string;
  href: AppHref | null;
};

export const writing: readonly WritingItem[] = [];
