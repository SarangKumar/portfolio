"use client";

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
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

type AreaChartProps = {
  title: string;
  description?: string;
  data: readonly TimeSeriesPoint[];
  series: readonly NamedSeries[];
  height?: number;
};

export function AreaChart({
  title,
  description,
  data,
  series,
  height,
}: AreaChartProps) {
  if (data.length === 0 || series.length === 0) {
    return null;
  }

  return (
    <ChartFrame title={title} description={description} height={height}>
      <RechartsAreaChart data={[...data]} margin={chartTheme.margin}>
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
          <Area
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.label}
            stroke={chartSeriesColor(index)}
            fill={chartSeriesColor(index)}
            fillOpacity={chartTheme.seriesFillOpacity}
            strokeWidth={1.5}
            isAnimationActive={false}
          />
        ))}
      </RechartsAreaChart>
    </ChartFrame>
  );
}
