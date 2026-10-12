import type { CSSProperties, ReactNode } from "react";
import { CheckCircle2, GraduationCap, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ExperienceKind } from "@/data/experience";

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

const kindLabel: Record<ExperienceKind, string> = {
  work: "Work",
  education: "Education",
};

type TimelineProps = {
  entries: readonly TimelineEntry[];
};

const RAIL_X = "1.125rem"; // the line's x-position == size-9 dot's radius
const INDENT = "3rem"; // where the title and body text start (dot + gap-3)

/**
 * One continuous line runs down the left edge through every entry — a
 * single "lifeline", not a rail per section. The dot sits right next to the
 * title, centered against it with `items-center` on a flex row they're both
 * in — not `top: 50%` on an absolutely-positioned dot, which looked right on
 * paper but doesn't actually work: a percentage `top` on an absolute child
 * only resolves against a parent with an explicit height, and this parent's
 * height is auto (sized by its one in-flow child, the title row), so every
 * browser falls back to the dot's static position instead of true 50% —
 * it rendered ~18px too high regardless of content length. Flexbox cross-
 * axis centering has no such gotcha. The dot is a normal (non-absolute) flex
 * item sized to exactly straddle the line's x-position, so it still lands
 * dead-center on the line without needing to be pulled out of flow at all.
 */
export function Timeline({ entries }: TimelineProps) {
  return (
    <ol className="flex flex-col">
      {entries.map((entry, index) => {
        const isFirst = index === 0;
        const isLast = index === entries.length - 1;
        const delay = 80 + index * 140;

        let lineBackground = "var(--border)";
        if (isFirst && isLast) {
          lineBackground =
            "linear-gradient(to bottom, transparent, var(--border) 2.5rem, var(--border) calc(100% - 2.5rem), transparent)";
        } else if (isFirst) {
          lineBackground =
            "linear-gradient(to bottom, transparent, var(--border) 2.5rem)";
        } else if (isLast) {
          lineBackground =
            "linear-gradient(to bottom, var(--border) calc(100% - 2.5rem), transparent)";
        }

        return (
          <li key={entry.id} className="relative pb-10 last:pb-0">
            {/* The line for this entry. Entries abut with no gap between
                them, so consecutive spans read as one continuous line. */}
            <span
              aria-hidden
              className="absolute top-0 bottom-0 w-0.5 -translate-x-1/2"
              style={{ left: RAIL_X, background: lineBackground }}
            />

            {/* Head row: dot and title are flex siblings, centered on each
                other by `items-center` — not by positioning math. The dot is
                size-9 (36px) starting flush at the line's x minus its own
                radius, so its center lands exactly on the line. */}
            <div className="flex items-center gap-3">
              <span
                className="timeline-dot border-primary/60 bg-card text-primary flex size-9 shrink-0 items-center justify-center rounded-full border-2 shadow-[0_0_0_4px_var(--background),0_0_16px_-4px_var(--glow)]"
                style={{ "--delay": `${delay}ms` } as CSSProperties}
              >
                {kindIcon[entry.kind]}
              </span>
              <div
                className="fade-up flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
                style={{ "--delay": `${delay}ms` } as CSSProperties}
              >
                <h3 className="text-sm font-semibold sm:text-base">
                  {entry.title}{" "}
                  <span className="text-muted-foreground font-normal">
                    · {entry.subtitle}
                  </span>
                </h3>
                <span className="meta shrink-0">{entry.meta}</span>
              </div>
            </div>

            {/* Body: the same indent as the title, so it reads as sitting
                under it, to the right of the line. */}
            <div
              className="fade-up mt-2 flex flex-col gap-2"
              style={
                {
                  paddingLeft: INDENT,
                  "--delay": `${delay + 80}ms`,
                } as CSSProperties
              }
            >
              <Badge variant="outline" className="w-fit font-normal">
                {kindLabel[entry.kind]}
              </Badge>

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
                      variant="secondary"
                      className="font-normal"
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
