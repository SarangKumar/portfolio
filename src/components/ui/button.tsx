import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const buttonVariants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
} as const;

export const buttonSizes = {
  sm: "h-7 px-2 type-small",
  md: "h-8 px-2.5 type-body",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export const buttonClassName = {
  base: cn(
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm font-medium",
    "transition-[color,background-color,border-color,transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
    "active:scale-[0.985]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  ),
};

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        buttonClassName.base,
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  );
}
