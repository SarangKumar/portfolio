import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = ComponentProps<"textarea">;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-20 w-full resize-y rounded-sm border border-input bg-background px-2 py-1.5 type-body text-foreground shadow-none",
        "placeholder:text-muted-foreground",
        "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-destructive",
        className,
      )}
      {...props}
    />
  );
}
