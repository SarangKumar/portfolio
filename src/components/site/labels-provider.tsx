"use client";

import { createContext, useContext, type ReactNode } from "react";
import { seed } from "@/content/seed";
import { label, type Labels } from "@/lib/labels";

const Ctx = createContext<Labels>(seed.site.labels);

export function LabelsProvider({
  labels,
  children,
}: {
  labels: Labels;
  children: ReactNode;
}) {
  return <Ctx.Provider value={labels}>{children}</Ctx.Provider>;
}

/** `const t = useT(); t("board.submit")` — content labels from site config. */
export function useT() {
  const labels = useContext(Ctx);
  return (key: string, vars?: Record<string, string | number>) =>
    label(labels, key, vars);
}
