import { cn } from "@/lib/utils";
import { ProjectIcon } from "./project-icon";

/** The bean mark — the portfolio's own app icon, same style as project icons. */
export function BeanMark({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <ProjectIcon
      src="/projects/portfolio.svg"
      title=""
      size={size}
      className={className}
    />
  );
}

export function BeanBlob({
  className,
  speed = -0.12,
}: {
  className?: string;
  speed?: number;
}) {
  return (
    <div
      aria-hidden
      data-parallax={speed}
      data-parallax-max={160}
      className={cn(
        "bean bg-primary/15 pointer-events-none absolute blur-2xl",
        className,
      )}
    />
  );
}
