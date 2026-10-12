import { Skeleton } from "@/components/ui/skeleton";
import { TypographyMuted } from "@/components/ui/typography";
import { contactProfile } from "@/data/contact";

type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type ContributionsResponse = {
  total: Record<string, number>;
  contributions: ContributionDay[];
};

const levelClass: Record<ContributionDay["level"], string> = {
  0: "bg-muted",
  1: "bg-primary/25",
  2: "bg-primary/50",
  3: "bg-primary/75",
  4: "bg-primary",
};

/** GitHub handle, read from the single contact data source (no second
 * hardcoded copy to drift out of sync). */
function githubUsername(): string | null {
  const link = contactProfile.socialLinks.find(
    (entry) => entry.id === "social-github",
  );

  if (!link) return null;

  try {
    const segment = new URL(link.href).pathname.replace(/^\/+|\/+$/g, "");
    return segment || null;
  } catch {
    return null;
  }
}

/**
 * Community-maintained wrapper around GitHub's contributions calendar
 * (github-contributions-api.jogruber.de) — no token needed. If it's
 * unreachable we fail quietly and render nothing; this is a flourish, not
 * load-bearing content.
 */
async function fetchContributions(
  username: string,
): Promise<ContributionsResponse | null> {
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 21_600 } },
    );

    if (!response.ok) return null;
    return (await response.json()) as ContributionsResponse;
  } catch {
    return null;
  }
}

/** Groups a flat day list into Sunday-start weeks, padding the first week
 * with nulls so every column lines up the same weekday row-for-row. */
function toWeeks(
  days: readonly ContributionDay[],
): (ContributionDay | null)[][] {
  if (days.length === 0) return [];

  const firstWeekday = new Date(`${days[0]!.date}T00:00:00Z`).getUTCDay();
  const padded: (ContributionDay | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...days,
  ];
  const weeks: (ContributionDay | null)[][] = [];

  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  return weeks;
}

export function GithubContributionsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-27 w-full" />
    </div>
  );
}

export async function GithubContributions() {
  const username = githubUsername();
  if (!username) return null;

  const data = await fetchContributions(username);
  if (!data || data.contributions.length === 0) return null;

  const weeks = toWeeks(data.contributions);
  const total =
    data.total.lastYear ??
    data.contributions.reduce((sum, day) => sum + day.count, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="section-title">GitHub activity</h2>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-primary text-sm transition-colors"
        >
          @{username}
        </a>
      </div>

      <div className="lift border-border bg-card/60 overflow-x-auto rounded-lg border p-4">
        <div className="flex w-max gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) =>
                day ? (
                  <span
                    key={day.date}
                    title={`${day.count} contribution${day.count === 1 ? "" : "s"} · ${day.date}`}
                    className={`size-2.75 rounded-[2px] ${levelClass[day.level]}`}
                  />
                ) : (
                  <span
                    key={dayIndex}
                    aria-hidden
                    className="size-2.75 rounded-[2px] bg-transparent"
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <TypographyMuted>
          {total} contribution{total === 1 ? "" : "s"} in the last year
        </TypographyMuted>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <span>Less</span>
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <span
              key={level}
              aria-hidden
              className={`size-2.75 rounded-[2px] ${levelClass[level]}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
