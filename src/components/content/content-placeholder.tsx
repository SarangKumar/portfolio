import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContentPlaceholderProps = {
  children: ReactNode;
  className?: string;
};

export function ContentPlaceholder({
  children,
  className,
}: ContentPlaceholderProps) {
  return (
    <p
      className={cn(
        "rounded-sm border border-dashed border-border bg-muted/40 px-3 py-2 type-small text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
