import type { ReactNode } from "react";
import { TypographyH1, TypographyLead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

/** Page intro with a staggered fade-up entrance, built on Vinyaas typography. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <header className="flex max-w-2xl flex-col gap-3">
      {eyebrow ? (
        <p
          className="chip fade-up w-fit"
          style={{ "--delay": "0ms" } as React.CSSProperties}
        >
          <span className="chip-dot" aria-hidden />
          {eyebrow}
        </p>
      ) : null}
      <TypographyH1
        className={cn("fade-up text-4xl sm:text-5xl")}
        style={{ "--delay": "60ms" } as React.CSSProperties}
      >
        {title}
      </TypographyH1>
      {description ? (
        <TypographyLead
          className="text-muted-foreground fade-up"
          style={{ "--delay": "120ms" } as React.CSSProperties}
        >
          {description}
        </TypographyLead>
      ) : null}
      {children}
    </header>
  );
}
