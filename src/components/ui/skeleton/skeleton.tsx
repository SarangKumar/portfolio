// Source: Vinyaas registry `skeleton` (new-york). Local change: `cn` from @/lib/cn.
import React from "react";

import { cn } from "@/lib/cn";

export type SkeletonProps = React.ComponentProps<"div">;

export function Skeleton({ className, ref, ...props }: SkeletonProps) {
  return (
    <div
      ref={ref}
      {...props}
      aria-hidden="true"
      className={cn(
        "bg-muted animate-pulse rounded-md motion-reduce:animate-none",
        className,
      )}
    />
  );
}
