"use client";

import { PublicTerminal as TerminalPanel } from "@/features/terminal/public-terminal";
import { ClientOnly } from "@/lib/client-only";

export function PublicTerminal() {
  return (
    <ClientOnly
      fallback={
        <div
          className="sticky bottom-0 z-40 h-[var(--terminal-ribbon)] border-t border-border bg-card"
          aria-hidden
        />
      }
    >
      <TerminalPanel />
    </ClientOnly>
  );
}
