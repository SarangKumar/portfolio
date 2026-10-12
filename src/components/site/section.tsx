import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageIntro({
  index,
  eyebrow,
  title,
  children,
  compact,
}: {
  index: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <header
      data-parallax="-0.1"
      data-parallax-max="28"
      className={cn(
        "fade-up container-x pb-12",
        compact ? "pt-8" : "pt-16 sm:pt-24",
      )}
    >
      <p className="eyebrow">
        {index}/ {eyebrow}
      </p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">{title}</h1>
      {children ? (
        <div className="text-muted-foreground mt-6 max-w-2xl text-lg">
          {children}
        </div>
      ) : null}
    </header>
  );
}

export function Section({
  index,
  title,
  aside,
  children,
  className,
}: {
  index?: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("container-x py-14", className)}>
      <div className="rule mb-8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 pt-4">
        <h2
          className="eyebrow whitespace-nowrap"
          data-parallax="0.08"
          data-parallax-max="14"
        >
          {index ? `${index}/ ` : ""}
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function TechTags({ items }: { items: string[] }) {
  if (!items.length) return null;
  return <p className="tag">{items.map((t) => `[${t}]`).join(" — ")}</p>;
}
