"use client";

import { usePathname } from "next/navigation";
import { ViewTransition, type ReactNode } from "react";

/**
 * Route-level view transition. Keyed by pathname so each navigation exits the
 * old page and enters the new one; the header, footer and terminal sit outside
 * and stay put. Falls back to an instant swap without browser support.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition
      key={pathname}
      enter="page-enter"
      exit="page-exit"
      default="none"
    >
      <div className="page-fallback">{children}</div>
    </ViewTransition>
  );
}
