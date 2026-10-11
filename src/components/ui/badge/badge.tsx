// Source: Vinyaas registry `badge` (new-york).
// Local changes: `cn` from @/lib/cn; adds `success`, `warning` and `info`
// status variants (tinted like `destructive`) for admin status badges.
import React from "react";

import { cn } from "@/lib/cn";

const badgeVariants = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-border bg-secondary text-secondary-foreground",
  destructive:
    "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
  outline: "border-border text-foreground",
  ghost:
    "border-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
  link: "border-transparent text-primary underline-offset-4 hover:underline",
  success: "border-transparent bg-success/10 text-success dark:bg-success/20",
  warning: "border-transparent bg-warning/10 text-warning dark:bg-warning/20",
  info: "border-transparent bg-info/10 text-info dark:bg-info/20",
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:size-3",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
