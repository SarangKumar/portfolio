"use client";

import { Tooltip } from "recharts";
import { chartTheme } from "@/components/charts/theme";

export function ChartTooltip() {
  return (
    <Tooltip
      cursor={chartTheme.tooltip.cursor}
      contentStyle={chartTheme.tooltip.contentStyle}
      labelStyle={chartTheme.tooltip.labelStyle}
      itemStyle={chartTheme.tooltip.itemStyle}
    />
  );
}
