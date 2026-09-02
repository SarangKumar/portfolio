"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame } from "@/components/charts/chart-frame";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import {
  chartSeriesColor,
  chartTheme,
  type CartesianPoint,
} from "@/components/charts/theme";

type BarChartProps = {
  title: string;
  description?: string;
  data: readonly CartesianPoint[];
  height?: number;
  valueLabel?: string;
};

export function BarChart({
  title,
  description,
  data,
  height,
  valueLabel = "Value",
}: BarChartProps) {
  if (data.length === 0) {
    return null;
  }

  return (
    <ChartFrame title={title} description={description} height={height}>
      <RechartsBarChart data={[...data]} margin={chartTheme.margin}>
        <CartesianGrid {...chartTheme.grid} />
        <XAxis
          dataKey="label"
          tick={chartTheme.tick}
          axisLine={chartTheme.axisLine}
          tickLine={false}
        />
        <YAxis
          tick={chartTheme.tick}
          axisLine={chartTheme.axisLine}
          tickLine={false}
          allowDecimals={false}
          width={28}
        />
        <ChartTooltip />
        <Bar
          dataKey="value"
          name={valueLabel}
          fill={chartSeriesColor(0)}
          maxBarSize={28}
          radius={[2, 2, 0, 0]}
          isAnimationActive={false}
        />
      </RechartsBarChart>
    </ChartFrame>
  );
}
