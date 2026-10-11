import type { CSSProperties, ReactNode } from "react";
import { CheckCircle2, GraduationCap, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ExperienceKind } from "@/data/experience";
import { cn } from "@/lib/utils";

export type TimelineEntry = {
  id: string;
  kind: ExperienceKind;
  title: string;
  subtitle: string;
  meta: string;
  description?: string | null;
  achievements?: readonly string[];
  tags?: readonly string[];
};

const kindIcon: Record<ExperienceKind, ReactNode> = {
  work: <Briefcase className="size-4" />,
  education: <GraduationCap className="size-4" />,
};

type TimelineProps = {
  entries: readonly TimelineEntry[];
  /** Stagger offset in ms, so a second timeline on the same page doesn't
   * replay in lockstep with the first. */
  delayOffset?: number;
};

/**
 * Vertical rail on the left connecting each entry's dot, with achievements
 * listed underneath as a checklist. The rail draws in on mount; each dot pops
 * once the rail reaches it.
 */
export function Timeline({ entries, delayOffset = 0 }: TimelineProps) {
  return (
    <ol className="relative flex flex-col gap-10 pl-2">
      <div
        aria-hidden
        className="timeline-grow from-primary/70 via-primary/20 absolute top-2 bottom-2 left-[1.05rem] w-0.5 origin-top rounded-full bg-linear-to-b to-transparent"
        style={{ "--delay": `${delayOffset}ms` } as CSSProperties}
      />
      {entries.map((entry, index) => {
        const delay = delayOffset + 120 + index * 140;
        return (
          <li key={entry.id} className="relative pl-10">
            <span
              className="timeline-dot border-primary/50 bg-card text-primary absolute left-0 flex size-9 items-center justify-center rounded-full border-2 shadow-[0_0_0_4px_var(--background),0_0_16px_-4px_var(--glow)]"
              style={{ "--delay": `${delay}ms` } as CSSProperties}
              aria-hidden
            >
              {kindIcon[entry.kind]}
            </span>

            <div
              className="fade-up flex flex-col gap-2"
              style={{ "--delay": `${delay + 80}ms` } as CSSProperties}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-sm font-semibold sm:text-base">
                  {entry.title}{" "}
                  <span className="text-muted-foreground font-normal">
                    · {entry.subtitle}
                  </span>
                </h3>
                <span className="meta shrink-0">{entry.meta}</span>
              </div>

              {entry.description ? (
                <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
                  {entry.description}
                </p>
              ) : null}

              {entry.achievements && entry.achievements.length > 0 ? (
                <ul className="mt-1 flex flex-col gap-1.5">
                  {entry.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle2 className="text-primary mt-0.5 size-3.5 shrink-0" />
                      <span className="text-foreground/90 leading-relaxed">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {entry.tags && entry.tags.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={cn("font-normal")}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
