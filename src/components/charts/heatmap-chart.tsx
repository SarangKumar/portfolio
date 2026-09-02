"use client";

import { cn } from "@/lib/cn";
import type { HeatmapCell } from "@/components/charts/theme";

type HeatmapChartProps = {
  title: string;
  description?: string;
  cells: readonly HeatmapCell[];
  className?: string;
};

export function HeatmapChart({
  title,
  description,
  cells,
  className,
}: HeatmapChartProps) {
  const xLabels = [...new Set(cells.map((cell) => cell.x))];
  const yLabels = [...new Set(cells.map((cell) => cell.y))];
  const max = Math.max(0, ...cells.map((cell) => cell.value));

  if (cells.length === 0 || xLabels.length === 0 || yLabels.length === 0) {
    return null;
  }

  const lookup = new Map(
    cells.map((cell) => [`${cell.x}:${cell.y}`, cell.value]),
  );

  return (
    <figure className={cn("stack-compact", className)}>
      <figcaption className="type-small font-medium text-foreground">
        {title}
      </figcaption>
      {description ? (
        <p className="type-metadata text-muted-foreground">{description}</p>
      ) : null}
      <svg
        role="img"
        aria-label={title}
        viewBox={`0 0 ${xLabels.length * 22 + 48} ${yLabels.length * 22 + 20}`}
        className="max-w-full text-foreground"
      >
        {yLabels.map((y, row) => (
          <text
            key={y}
            x={0}
            y={row * 22 + 28}
            className="fill-muted-foreground"
            fontSize={10}
          >
            {y}
          </text>
        ))}
        {xLabels.map((x, column) => (
          <text
            key={x}
            x={column * 22 + 56}
            y={10}
            className="fill-muted-foreground"
            fontSize={10}
            textAnchor="middle"
          >
            {x}
          </text>
        ))}
        {yLabels.map((y, row) =>
          xLabels.map((x, column) => {
            const value = lookup.get(`${x}:${y}`) ?? 0;
            const opacity = max === 0 ? 0.08 : Math.max(0.08, value / max);

            return (
              <rect
                key={`${x}:${y}`}
                x={column * 22 + 46}
                y={row * 22 + 16}
                width={18}
                height={18}
                rx={2}
                fill="var(--chart-1)"
                fillOpacity={opacity}
              >
                <title>{`${y} ${x}: ${value}`}</title>
              </rect>
            );
          }),
        )}
      </svg>
    </figure>
  );
}
