import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const fieldClassName = cn(
  "w-full rounded-sm border border-input bg-background px-2 type-body text-foreground shadow-none",
  "placeholder:text-muted-foreground",
  "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-[invalid=true]:border-destructive",
);

export type InputProps = ComponentProps<"input">;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(fieldClassName, "h-8", className)}
      {...props}
    />
  );
}
