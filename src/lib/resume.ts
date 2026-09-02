import type { ResumeVersion } from "@/data/resumes";

export function defaultResume(
  items: readonly ResumeVersion[],
): ResumeVersion | undefined {
  return items.find((item) => item.isDefault) ?? items[0];
}
