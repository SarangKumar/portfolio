"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
} from "recharts";
import { ChartFrame } from "@/components/charts/chart-frame";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import {
  chartSeriesColor,
  chartTheme,
  type NamedSeries,
  type RadarPoint,
} from "@/components/charts/theme";

type RadarChartProps = {
  title: string;
  description?: string;
  data: readonly RadarPoint[];
  series: readonly NamedSeries[];
  height?: number;
};

export function RadarChart({
  title,
  description,
  data,
  series,
  height = chartTheme.radarHeight,
}: RadarChartProps) {
  if (data.length < 3 || series.length === 0) {
    return null;
  }

  return (
    <ChartFrame
      title={title}
      description={description}
      height={height}
      summary={
        <ul>
          {data.map((point) => (
            <li key={point.axis}>
              {point.axis}
              {series
                .map(
                  (item) => `: ${item.label} ${String(point[item.key] ?? 0)}`,
                )
                .join("")}
            </li>
          ))}
        </ul>
      }
    >
      <RechartsRadarChart
        data={[...data]}
        margin={chartTheme.margin}
        outerRadius="72%"
      >
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="axis" tick={chartTheme.tick} />
        <PolarRadiusAxis
          tick={chartTheme.tick}
          axisLine={false}
          allowDecimals={false}
        />
        <ChartTooltip />
        {series.map((item, index) => (
          <Radar
            key={item.key}
            name={item.label}
            dataKey={item.key}
            stroke={chartSeriesColor(index)}
            fill={chartSeriesColor(index)}
            fillOpacity={chartTheme.seriesFillOpacity}
            isAnimationActive={false}
          />
        ))}
      </RechartsRadarChart>
    </ChartFrame>
  );
}
