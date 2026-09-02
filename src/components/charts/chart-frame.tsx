"use client";

import type { ReactElement, ReactNode } from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/cn";
import { chartTheme } from "@/components/charts/theme";

type ChartFrameProps = {
  title: string;
  description?: string;
  height?: number;
  className?: string;
  children: ReactElement;
  summary?: ReactNode;
};

export function ChartFrame({
  title,
  description,
  height = chartTheme.height,
  className,
  children,
  summary,
}: ChartFrameProps) {
  return (
    <figure className={cn("stack-compact", className)}>
      <figcaption className="type-small font-medium text-foreground">
        {title}
      </figcaption>
      {description ? (
        <p className="type-metadata text-muted-foreground">{description}</p>
      ) : null}
      <div
        className="w-full min-w-0"
        style={{ height }}
        role="img"
        aria-label={title}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={height}
        >
          {children}
        </ResponsiveContainer>
      </div>
      {summary ? <div className="sr-only">{summary}</div> : null}
    </figure>
  );
}
