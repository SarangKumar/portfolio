"use client";

import { useMemo, useState } from "react";
import {
  RelatedItemList,
  type RelatedItem,
} from "@/components/content/related-item-list";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { layoutExperienceBars, timelineYearLabels } from "@/lib/dates";

export type ExperienceTimelineItem = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  periodLabel: string;
  description: string | null;
  technologies: readonly RelatedItem[];
  projects: readonly RelatedItem[];
  achievements: readonly string[];
};

export type ExperienceTimelineCopy = {
  groupBy: string;
  byTime: string;
  byCompany: string;
  byRole: string;
  timeline: string;
  details: string;
  technologies: string;
  projects: string;
  achievements: string;
  noRelated: string;
  noDescription: string;
  noAchievements: string;
};

type GroupMode = "time" | "company" | "role";

type ExperienceTimelineProps = {
  items: readonly ExperienceTimelineItem[];
  copy: ExperienceTimelineCopy;
  initialSelectedId?: string;
};

function groupItems(
  items: readonly ExperienceTimelineItem[],
  mode: GroupMode,
): readonly {
  key: string;
  label: string;
  items: readonly ExperienceTimelineItem[];
}[] {
  if (mode === "time") {
    return [
      {
        key: "time",
        label: "",
        items: [...items].sort((a, b) =>
          b.startDate.localeCompare(a.startDate),
        ),
      },
    ];
  }

  const groups = new Map<string, ExperienceTimelineItem[]>();

  for (const item of items) {
    const label = mode === "company" ? item.company : item.role;
    const current = groups.get(label) ?? [];
    current.push(item);
    groups.set(label, current);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, grouped]) => ({
      key: label,
      label,
      items: grouped.sort((a, b) => b.startDate.localeCompare(a.startDate)),
    }));
}

export function ExperienceTimeline({
  items,
  copy,
  initialSelectedId,
}: ExperienceTimelineProps) {
  const [nowMs] = useState(() => Date.now());
  const [mode, setMode] = useState<GroupMode>("time");
  const [selectedId, setSelectedId] = useState(() => {
    if (
      initialSelectedId &&
      items.some((item) => item.id === initialSelectedId)
    ) {
      return initialSelectedId;
    }

    return items[0]?.id ?? "";
  });

  const bars = useMemo(
    () => layoutExperienceBars(items, nowMs),
    [items, nowMs],
  );
  const years = useMemo(() => timelineYearLabels(items, nowMs), [items, nowMs]);
  const barById = useMemo(
    () => new Map(bars.map((bar) => [bar.id, bar])),
    [bars],
  );
  const groups = useMemo(() => groupItems(items, mode), [items, mode]);
  const selected =
    items.find((item) => item.id === selectedId) ?? items[0] ?? null;

  const modes: readonly { id: GroupMode; label: string }[] = [
    { id: "time", label: copy.byTime },
    { id: "company", label: copy.byCompany },
    { id: "role", label: copy.byRole },
  ];

  return (
    <div className="stack-default">
      <div
        role="group"
        aria-label={copy.groupBy}
        className="flex flex-wrap gap-1"
      >
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={mode === item.id}
            className={cn(
              "rounded-sm border px-2 py-1 type-small transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
              mode === item.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-transparent text-foreground hover:bg-muted",
            )}
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="stack-compact">
          {years.length > 0 ? (
            <div
              aria-hidden="true"
              className="flex justify-between type-metadata px-1"
            >
              {years.map((year) => (
                <span key={year}>{year}</span>
              ))}
            </div>
          ) : null}

          <ul aria-label={copy.timeline} className="stack-compact">
            {groups.map((group) => (
              <li key={group.key} className="stack-compact">
                {group.label ? (
                  <p className="type-label text-muted-foreground">
                    {group.label}
                  </p>
                ) : null}
                {group.items.map((item) => {
                  const bar = barById.get(item.id);
                  const isSelected = selected?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      id={item.id}
                      type="button"
                      aria-pressed={isSelected}
                      aria-current={isSelected ? "true" : undefined}
                      className={cn(
                        "w-full rounded-md border pad-card text-left stack-compact",
                        isSelected
                          ? "border-primary bg-card"
                          : "border-border bg-card surface-interactive",
                      )}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <span className="type-small font-semibold text-card-foreground">
                        {item.role}
                      </span>
                      <span className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="type-small text-muted-foreground">
                          {item.company}
                        </span>
                        <span className="type-metadata">
                          {item.periodLabel}
                        </span>
                      </span>
                      {bar ? (
                        <span
                          aria-hidden="true"
                          className="relative mt-1 block h-1.5 overflow-hidden rounded-sm bg-muted"
                        >
                          <span
                            className="absolute inset-y-0 rounded-sm bg-primary"
                            style={{
                              left: `${bar.offset * 100}%`,
                              width: `${bar.span * 100}%`,
                            }}
                          />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </li>
            ))}
          </ul>
        </div>

        {selected ? (
          <Card
            aria-label={copy.details}
            className="stack-compact transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]"
          >
            <p className="type-small font-semibold text-card-foreground">
              {selected.role}
            </p>
            <p className="type-small text-muted-foreground">
              {selected.company}
            </p>
            <p className="type-metadata">{selected.periodLabel}</p>
            <p className="type-small text-muted-foreground">
              {selected.description ?? copy.noDescription}
            </p>
            <div className="stack-compact">
              <p className="type-label text-muted-foreground">
                {copy.technologies}
              </p>
              <RelatedItemList
                items={selected.technologies}
                emptyLabel={copy.noRelated}
              />
            </div>
            <div className="stack-compact">
              <p className="type-label text-muted-foreground">
                {copy.projects}
              </p>
              <RelatedItemList
                items={selected.projects}
                emptyLabel={copy.noRelated}
              />
            </div>
            <div className="stack-compact">
              <p className="type-label text-muted-foreground">
                {copy.achievements}
              </p>
              {selected.achievements.length > 0 ? (
                <ul className="stack-compact">
                  {selected.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="type-small text-muted-foreground"
                    >
                      {achievement}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="type-small text-muted-foreground">
                  {copy.noAchievements}
                </p>
              )}
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
