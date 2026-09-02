import { describe, expect, it } from "@jest/globals";
import {
  formatExperiencePeriod,
  layoutExperienceBars,
  timelineYearLabels,
  yearMonthToUtc,
} from "@/lib/dates";

describe("dates", () => {
  it("formats inclusive public experience periods", () => {
    expect(formatExperiencePeriod("2020-01", "2022-06", "en", "Present")).toBe(
      "Jan 2020 – Jun 2022",
    );
    expect(formatExperiencePeriod("2024-03", null, "en", "Present")).toBe(
      "Mar 2024 – Present",
    );
  });

  it("lays out duration bars against a shared time range", () => {
    const nowMs = Date.UTC(2024, 0, 1);
    const bars = layoutExperienceBars(
      [
        { id: "a", startDate: "2020-01", endDate: "2022-01" },
        { id: "b", startDate: "2022-01", endDate: null },
      ],
      nowMs,
    );

    expect(bars).toHaveLength(2);
    expect(bars[0]?.offset).toBe(0);
    expect(bars[1]?.offset).toBeGreaterThan(0);
    expect(bars[0]?.span).toBeGreaterThan(0);
    expect(bars[1]?.span).toBeGreaterThan(0);
  });

  it("labels the first and last years on the timeline", () => {
    expect(
      timelineYearLabels(
        [{ startDate: "2020-01", endDate: "2022-06" }],
        Date.UTC(2024, 0, 1),
      ),
    ).toEqual([2020, 2022]);
    expect(yearMonthToUtc("2020-01")).toBe(Date.UTC(2020, 0, 1));
  });
});
