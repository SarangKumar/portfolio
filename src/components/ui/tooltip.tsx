"use client";

import {
  cloneElement,
  isValidElement,
  useId,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom";
  className?: string;
};

export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: TooltipProps) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);
  const describedBy = open ? tooltipId : undefined;

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
        "aria-describedby": describedBy,
      })
    : children;

  function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
      onKeyDown={handleKeyDown}
    >
      {trigger}
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-sm border border-border bg-secondary px-1.5 py-0.5 type-small text-secondary-foreground",
            side === "top" && "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
            side === "bottom" && "top-full left-1/2 mt-1.5 -translate-x-1/2",
            className,
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
