import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AdminFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export function AdminField({
  id,
  label,
  error,
  hint,
  className,
  children,
}: AdminFieldProps) {
  return (
    <div className={cn("stack-compact", className)}>
      <label htmlFor={id} className="type-small font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="type-metadata text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="type-small text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
