import type { Content } from "@/content/types";
import {
  formatDuration,
  formatMonth,
  groupExperience,
  monthsBetween,
} from "@/lib/derive";
import { label } from "@/lib/labels";

/**
 * LinkedIn-style experience: one block per company, roles on a timeline.
 * The rail is a single absolutely-positioned 1px line at a fixed x (RAIL);
 * each dot is centred on that same x with translate(-50%), so they always line up.
 */

export function ExperienceList({
  content,
  compact = false,
  showHighlights = false,
}: {
  content: Content;
  compact?: boolean;
  showHighlights?: boolean;
}) {
  const L = content.site.labels;
  const t = (k: string, v?: Record<string, string | number>) => label(L, k, v);
  const groups = groupExperience(content);
  return (
    <ol className={compact ? "space-y-10" : "space-y-16"}>
      {groups.map((g) => (
        <li
          key={g.company}
          className="grid gap-5 md:grid-cols-[16rem_1fr] md:gap-10"
        >
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl">
              {g.companyUrl ? (
                <a
                  href={g.companyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link-u"
                >
                  {g.company}
                </a>
              ) : (
                g.company
              )}
            </h3>
            <p className="tag mt-2">{formatDuration(L, g.months)}</p>
            {!compact ? (
              <p className="text-muted-foreground mt-1 text-sm">
                {[g.location, g.workplace].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </div>
          <ol>
            {g.roles.map((r, i) => {
              const last = i === g.roles.length - 1;
              const pad = compact ? "1.5rem" : "2.5rem";
              const myPad = i ? pad : "0rem";
              // Dot centre sits on the first text line's centre (text-lg leading-tight ≈ 1.375rem).
              const centre = `calc(${myPad} + 0.6875rem)`;
              return (
                <li
                  key={r.id}
                  id={r.id}
                  className="relative scroll-mt-24 pl-8"
                  style={{ paddingTop: myPad }}
                >
                  {!last ? (
                    <span
                      aria-hidden
                      className="bg-border absolute left-[7px] w-px -translate-x-1/2"
                      style={{
                        top: centre,
                        bottom: `calc(-1 * (${pad} + 0.6875rem))`,
                      }}
                    />
                  ) : null}
                  <span
                    aria-hidden
                    className="bg-primary ring-background absolute left-[7px] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4"
                    style={{ top: centre }}
                  />
                  <p className="text-lg leading-tight font-medium">{r.role}</p>
                  <p className="tag mt-1.5">
                    {[
                      r.employmentType,
                      `${formatMonth(r.start)} – ${r.end ? formatMonth(r.end) : t("experience.present")}`,
                      formatDuration(L, monthsBetween(r.start, r.end)),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {!compact && r.description ? (
                    <p className="text-foreground/85 mt-4 max-w-3xl leading-relaxed">
                      {r.description}
                    </p>
                  ) : null}
                  {showHighlights && r.highlights.length ? (
                    <ul className="text-foreground/85 mt-4 max-w-3xl list-disc space-y-2 pl-5 leading-relaxed marker:text-primary">
                      {r.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                  {!compact && r.skills.length ? (
                    <p className="text-muted-foreground mt-4 text-sm">
                      <span className="eyebrow">
                        {t("experience.skills")} ·{" "}
                      </span>
                      {r.skills.join(" · ")}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </li>
      ))}
    </ol>
  );
}
