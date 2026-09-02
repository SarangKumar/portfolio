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

type HorizontalBarChartProps = {
  title: string;
  description?: string;
  data: readonly CartesianPoint[];
  height?: number;
  valueLabel?: string;
};

export function HorizontalBarChart({
  title,
  description,
  data,
  height,
  valueLabel = "Value",
}: HorizontalBarChartProps) {
  if (data.length === 0) {
    return null;
  }

  const chartHeight = height ?? Math.max(chartTheme.height, data.length * 36);

  return (
    <ChartFrame
      title={title}
      description={description}
      height={chartHeight}
      summary={
        <ul>
          {data.map((item) => (
            <li key={item.label}>
              {item.label}: {item.value}
            </li>
          ))}
        </ul>
      }
    >
      <RechartsBarChart
        layout="vertical"
        data={[...data]}
        margin={{ ...chartTheme.margin, left: 8, right: 16 }}
      >
        <CartesianGrid {...chartTheme.grid} horizontal={false} vertical />
        <XAxis
          type="number"
          tick={chartTheme.tick}
          axisLine={chartTheme.axisLine}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={chartTheme.tick}
          axisLine={false}
          tickLine={false}
          width={96}
        />
        <ChartTooltip />
        <Bar
          dataKey="value"
          name={valueLabel}
          fill={chartSeriesColor(0)}
          maxBarSize={14}
          radius={[0, 2, 2, 0]}
          isAnimationActive={false}
        />
      </RechartsBarChart>
    </ChartFrame>
  );
}
