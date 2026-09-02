"use client";

import dynamic from "next/dynamic";

const chartPlaceholder = (
  <div className="h-44 rounded-md border border-border bg-muted" aria-hidden />
);

export const HorizontalBarChart = dynamic(
  () =>
    import("@/components/charts/horizontal-bar-chart").then(
      (mod) => mod.HorizontalBarChart,
    ),
  { ssr: false, loading: () => chartPlaceholder },
);

export const RadarChart = dynamic(
  () => import("@/components/charts/radar-chart").then((mod) => mod.RadarChart),
  { ssr: false, loading: () => chartPlaceholder },
);
