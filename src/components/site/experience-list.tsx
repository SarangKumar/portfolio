import type { Content } from "@/content/types";
import {
  formatDuration,
  formatMonth,
  groupExperience,
  monthsBetween,
} from "@/lib/derive";
import { label } from "@/lib/labels";

/** LinkedIn-style experience: one block per company, roles on a timeline. */
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
    <ol className="space-y-12">
      {groups.map((g) => (
        <li key={g.company} className="grid gap-4 md:grid-cols-[14rem_1fr]">
          <div>
            <h3 className="font-serif text-2xl">
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
            <p className="tag mt-1">{formatDuration(L, g.months)}</p>
            {!compact ? (
              <p className="text-muted-foreground mt-1 text-sm">
                {[g.location, g.workplace].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </div>
          <ol className="border-border relative space-y-8 border-l pl-6">
            {g.roles.map((r) => (
              <li key={r.id} id={r.id} className="relative scroll-mt-24">
                <span
                  aria-hidden
                  className="bean bg-primary absolute top-2 -left-[29px] size-2.5"
                />
                <p className="font-medium">{r.role}</p>
                <p className="tag mt-1">
                  {[
                    r.employmentType,
                    `${formatMonth(r.start)} – ${r.end ? formatMonth(r.end) : t("experience.present")}`,
                    formatDuration(L, monthsBetween(r.start, r.end)),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {!compact && r.description ? (
                  <p className="text-foreground/85 mt-3 leading-relaxed">
                    {r.description}
                  </p>
                ) : null}
                {showHighlights && r.highlights.length ? (
                  <ul className="text-foreground/85 mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                    {r.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                ) : null}
                {!compact && r.skills.length ? (
                  <p className="text-muted-foreground mt-3 text-sm">
                    <span className="eyebrow">{t("experience.skills")} · </span>
                    {r.skills.join(" · ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
