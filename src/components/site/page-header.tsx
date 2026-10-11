import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

/** Page intro with a staggered fade-up entrance. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 max-w-2xl">
      {eyebrow ? (
        <p
          className="chip fade-up w-fit"
          style={{ "--delay": "0ms" } as React.CSSProperties}
        >
          <span className="chip-dot" aria-hidden />
          {eyebrow}
        </p>
      ) : null}
      <h1
        className="page-title fade-up"
        style={{ "--delay": "60ms" } as React.CSSProperties}
      >
        {title}
      </h1>
      {description ? (
        <p
          className="text-muted-foreground fade-up text-base leading-relaxed"
          style={{ "--delay": "120ms" } as React.CSSProperties}
        >
          {description}
        </p>
      ) : null}
      {children}
    </header>
  );
}
