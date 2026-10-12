import { seed } from "@/content/seed";

export type Labels = Record<string, string>;

/** Look up a content label (falling back to seed) and fill {placeholders}. */
export function label(
  labels: Labels,
  key: string,
  vars: Record<string, string | number> = {},
) {
  const raw = labels[key] ?? seed.site.labels[key] ?? key;
  return raw.replace(/\{(\w+)\}/g, (_, k: string) =>
    String(vars[k] ?? `{${k}}`),
  );
}
