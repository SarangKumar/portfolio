export const chartColorVars = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export function chartSeriesColor(index: number): string {
  return chartColorVars[index % chartColorVars.length] ?? chartColorVars[0];
}

export const chartTheme = {
  height: 176,
  radarHeight: 220,
  margin: { top: 8, right: 8, bottom: 4, left: 4 },
  grid: {
    stroke: "var(--border)",
    strokeDasharray: "3 3",
    vertical: false,
  },
  tick: {
    fill: "var(--muted-foreground)",
    fontSize: 11,
  },
  axisLine: {
    stroke: "var(--border)",
  },
  tooltip: {
    contentStyle: {
      backgroundColor: "var(--secondary)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)",
      color: "var(--secondary-foreground)",
      fontSize: 12,
      padding: "6px 8px",
    },
    labelStyle: {
      color: "var(--foreground)",
      fontSize: 12,
    },
    itemStyle: {
      color: "var(--secondary-foreground)",
      fontSize: 12,
    },
    cursor: {
      fill: "var(--muted)",
      fillOpacity: 0.45,
    },
  },
  seriesFillOpacity: 0.18,
} as const;

export type CartesianPoint = {
  label: string;
  value: number;
};

export type TimeSeriesPoint = {
  period: string;
} & Record<string, string | number>;

export type NamedSeries = {
  key: string;
  label: string;
};

export type RadarPoint = {
  axis: string;
} & Record<string, string | number>;

export type DistributionPoint = {
  label: string;
  value: number;
};

export type HeatmapCell = {
  x: string;
  y: string;
  value: number;
};
