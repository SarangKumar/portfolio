"use client";

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame } from "@/components/charts/chart-frame";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import {
  chartSeriesColor,
  chartTheme,
  type NamedSeries,
  type TimeSeriesPoint,
} from "@/components/charts/theme";

type LineChartProps = {
  title: string;
  description?: string;
  data: readonly TimeSeriesPoint[];
  series: readonly NamedSeries[];
  height?: number;
};

export function LineChart({
  title,
  description,
  data,
  series,
  height,
}: LineChartProps) {
  if (data.length === 0 || series.length === 0) {
    return null;
  }

  return (
    <ChartFrame title={title} description={description} height={height}>
      <RechartsLineChart data={[...data]} margin={chartTheme.margin}>
        <CartesianGrid {...chartTheme.grid} />
        <XAxis
          dataKey="period"
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
        {series.map((item, index) => (
          <Line
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.label}
            stroke={chartSeriesColor(index)}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </RechartsLineChart>
    </ChartFrame>
  );
}
