"use client";

import dynamic from "next/dynamic";

export const PublicTerminal = dynamic(
  () =>
    import("@/features/terminal/public-terminal").then(
      (mod) => mod.PublicTerminal,
    ),
  { ssr: false },
);
