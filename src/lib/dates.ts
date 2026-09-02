const YEAR_MONTH = /^(\d{4})-(\d{2})$/;

export function yearMonthToUtc(value: string): number {
  const match = YEAR_MONTH.exec(value);

  if (!match) {
    throw new Error(`Expected YYYY-MM, received "${value}"`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  return Date.UTC(year, month - 1, 1);
}

export function formatYearMonth(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(yearMonthToUtc(value)));
}

export function formatExperiencePeriod(
  startDate: string,
  endDate: string | null,
  locale: string,
  presentLabel: string,
): string {
  const start = formatYearMonth(startDate, locale);
  const end = endDate ? formatYearMonth(endDate, locale) : presentLabel;

  return `${start} – ${end}`;
}

export type TimelineBar = {
  id: string;
  offset: number;
  span: number;
};

const MIN_SPAN = 0.04;

export function layoutExperienceBars(
  items: readonly { id: string; startDate: string; endDate: string | null }[],
  nowMs: number,
): readonly TimelineBar[] {
  if (items.length === 0) {
    return [];
  }

  const ranges = items.map((item) => {
    const startMs = yearMonthToUtc(item.startDate);
    const endMs = item.endDate ? yearMonthToUtc(item.endDate) : nowMs;

    return {
      id: item.id,
      startMs,
      endMs: Math.max(endMs, startMs),
    };
  });

  const minStart = Math.min(...ranges.map((item) => item.startMs));
  const maxEnd = Math.max(...ranges.map((item) => item.endMs));
  const duration = Math.max(maxEnd - minStart, 1);

  return ranges.map((item) => {
    const span = Math.max((item.endMs - item.startMs) / duration, MIN_SPAN);
    const offset = (item.startMs - minStart) / duration;
    const clampedOffset = Math.min(offset, 1 - span);

    return {
      id: item.id,
      offset: clampedOffset,
      span,
    };
  });
}

export function timelineYearLabels(
  items: readonly { startDate: string; endDate: string | null }[],
  nowMs: number,
): readonly number[] {
  if (items.length === 0) {
    return [];
  }

  const starts = items.map((item) =>
    new Date(yearMonthToUtc(item.startDate)).getUTCFullYear(),
  );
  const ends = items.map((item) =>
    item.endDate
      ? new Date(yearMonthToUtc(item.endDate)).getUTCFullYear()
      : new Date(nowMs).getUTCFullYear(),
  );

  const minYear = Math.min(...starts);
  const maxYear = Math.max(...ends);

  if (minYear === maxYear) {
    return [minYear];
  }

  return [minYear, maxYear];
}
