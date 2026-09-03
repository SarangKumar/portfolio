"use client";

import type { ComponentProps } from "react";
import { HorizontalBarChart as HorizontalBarChartView } from "@/components/charts/horizontal-bar-chart";
import { RadarChart as RadarChartView } from "@/components/charts/radar-chart";
import { ClientOnly } from "@/lib/client-only";

const chartPlaceholder = (
  <div className="h-44 rounded-md border border-border bg-muted" aria-hidden />
);

export function HorizontalBarChart(
  props: ComponentProps<typeof HorizontalBarChartView>,
) {
  return (
    <ClientOnly fallback={chartPlaceholder}>
      <HorizontalBarChartView {...props} />
    </ClientOnly>
  );
}

export function RadarChart(props: ComponentProps<typeof RadarChartView>) {
  return (
    <ClientOnly fallback={chartPlaceholder}>
      <RadarChartView {...props} />
    </ClientOnly>
  );
}
