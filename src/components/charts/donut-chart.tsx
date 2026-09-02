"use client";

import { Cell, Pie, PieChart } from "recharts";
import { ChartFrame } from "@/components/charts/chart-frame";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import {
  chartSeriesColor,
  chartTheme,
  type DistributionPoint,
} from "@/components/charts/theme";

type DonutChartProps = {
  title: string;
  description?: string;
  data: readonly DistributionPoint[];
  height?: number;
};

export function DonutChart({
  title,
  description,
  data,
  height,
}: DonutChartProps) {
  const points = data.filter((item) => item.value > 0);

  if (points.length === 0) {
    return null;
  }

  return (
    <ChartFrame title={title} description={description} height={height}>
      <PieChart margin={chartTheme.margin}>
        <Pie
          data={[...points]}
          dataKey="value"
          nameKey="label"
          innerRadius="62%"
          outerRadius="80%"
          paddingAngle={2}
          isAnimationActive={false}
        >
          {points.map((item, index) => (
            <Cell
              key={item.label}
              fill={chartSeriesColor(index)}
              stroke="var(--card)"
            />
          ))}
        </Pie>
        <ChartTooltip />
      </PieChart>
    </ChartFrame>
  );
}
