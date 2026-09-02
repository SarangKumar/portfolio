import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const badgeVariants = {
  default: "border-border bg-muted text-foreground",
  primary: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  outline: "border-border bg-transparent text-foreground",
  success: "border-transparent bg-success text-success-foreground",
  warning: "border-transparent bg-warning text-warning-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
  info: "border-transparent bg-info text-info-foreground",
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

export type BadgeProps = ComponentProps<"span"> & {
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
        "inline-flex items-center rounded-sm border px-1.5 py-px type-label",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
