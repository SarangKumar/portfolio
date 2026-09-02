import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageSectionProps = {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageSection({
  id,
  title,
  description,
  action,
  children,
  className,
}: PageSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("stack-default", className)}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="stack-compact min-w-0">
          <h2 id={headingId} className="type-heading">
            {title}
          </h2>
          {description ? (
            <p className="type-small text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      {children}
    </section>
  );
}
