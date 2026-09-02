import { describe, expect, it } from "@jest/globals";
import {
  FEATURED_PROJECT_LIMIT,
  popularityChartPoints,
  rankProjectsByPopularity,
} from "@/analytics/ranking";
import {
  hasUsefulPopularityData,
  hasUsefulRadarData,
  skillCategoryRadarPoints,
} from "@/analytics/visualizations";
import { chartColorVars, chartSeriesColor } from "@/components/charts/theme";

describe("rankProjectsByPopularity", () => {
  const items = [
    { slug: "alpha", title: "Alpha" },
    { slug: "beta", title: "Beta" },
    { slug: "gamma", title: "Gamma" },
    { slug: "delta", title: "Delta" },
  ];

  it("uses catalog order when analytics are unpublished", () => {
    const ranked = rankProjectsByPopularity(items, {}, FEATURED_PROJECT_LIMIT);

    expect(ranked.map((entry) => entry.item.slug)).toEqual([
      "alpha",
      "beta",
      "gamma",
    ]);
    expect(ranked.every((entry) => entry.source === "fallback")).toBe(true);
  });

  it("ranks analytics hits first and fills from the catalog", () => {
    const ranked = rankProjectsByPopularity(items, { delta: 5, gamma: 4 });

    expect(ranked.map((entry) => [entry.item.slug, entry.source])).toEqual([
      ["delta", "analytics"],
      ["gamma", "analytics"],
      ["alpha", "fallback"],
    ]);
  });
});

describe("popularityChartPoints", () => {
  it("omits fallback slots with no views", () => {
    const points = popularityChartPoints([
      {
        item: { slug: "delta", title: "Delta" },
        viewCount: 4,
        source: "analytics",
      },
      {
        item: { slug: "alpha", title: "Alpha" },
        viewCount: 0,
        source: "fallback",
      },
    ]);

    expect(points).toEqual([{ label: "Delta", value: 4 }]);
    expect(hasUsefulPopularityData(points)).toBe(true);
    expect(hasUsefulPopularityData([])).toBe(false);
  });
});

describe("skillCategoryRadarPoints", () => {
  it("maps evidence counts and refuses sparse or empty series", () => {
    const points = skillCategoryRadarPoints([
      {
        categoryId: "a",
        label: "Languages",
        skillCount: 1,
        projectCount: 2,
        experienceCount: 1,
      },
      {
        categoryId: "b",
        label: "Platforms",
        skillCount: 1,
        projectCount: 0,
        experienceCount: 1,
      },
      {
        categoryId: "c",
        label: "Practices",
        skillCount: 1,
        projectCount: 1,
        experienceCount: 0,
      },
      {
        categoryId: "d",
        label: "Empty",
        skillCount: 0,
        projectCount: 0,
        experienceCount: 0,
      },
    ]);

    expect(points).toEqual([
      { axis: "Languages", projects: 2, roles: 1 },
      { axis: "Platforms", projects: 0, roles: 1 },
      { axis: "Practices", projects: 1, roles: 0 },
    ]);
    expect(hasUsefulRadarData(points)).toBe(true);
    expect(
      hasUsefulRadarData([
        { axis: "A", projects: 0, roles: 0 },
        { axis: "B", projects: 0, roles: 0 },
        { axis: "C", projects: 0, roles: 0 },
      ]),
    ).toBe(false);
    expect(
      hasUsefulRadarData([
        { axis: "A", projects: 1, roles: 0 },
        { axis: "B", projects: 0, roles: 1 },
      ]),
    ).toBe(false);
  });
});

describe("chart tokens", () => {
  it("uses semantic chart variables instead of a hardcoded palette", () => {
    expect(chartColorVars).toEqual([
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ]);
    expect(chartSeriesColor(0)).toBe("var(--chart-1)");
    expect(chartSeriesColor(5)).toBe("var(--chart-1)");
  });
});
