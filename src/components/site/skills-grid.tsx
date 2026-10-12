import Link from "next/link";
import type { Content } from "@/content/types";
import { deriveSkills, groupSkills } from "@/lib/derive";
import { label } from "@/lib/labels";
import { cn } from "@/lib/utils";

const DOTS: Record<string, number> = { expert: 3, proficient: 2, familiar: 1 };

/** Grouped skills, derived from projects + experience with admin overrides. */
export function SkillsGrid({ content }: { content: Content }) {
  const L = content.site.labels;
  const groups = groupSkills(content, deriveSkills(content));
  return (
    <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <section key={g.category}>
          <h3 className="eyebrow border-border border-b pb-2">{g.category}</h3>
          <ul className="mt-4 space-y-3">
            {g.skills.map((s) => {
              const used = [...s.projects, ...s.experience];
              return (
                <li key={s.name} className="text-sm">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className={cn(s.featured && "font-serif text-lg")}>
                      {s.name}
                    </span>
                    {s.proficiency ? (
                      <span
                        className="flex gap-0.5"
                        title={label(L, `skills.${s.proficiency}`)}
                      >
                        <span className="sr-only">
                          {label(L, `skills.${s.proficiency}`)}
                        </span>
                        {[1, 2, 3].map((i) => (
                          <span
                            key={i}
                            aria-hidden
                            className={cn(
                              "bean size-1.5",
                              i <= (DOTS[s.proficiency] ?? 0)
                                ? "bg-primary"
                                : "bg-muted",
                            )}
                          />
                        ))}
                      </span>
                    ) : null}
                  </span>
                  {used.length ? (
                    <span className="tag mt-0.5 block truncate">
                      {used.map((u, i) => (
                        <span key={u.href}>
                          {i ? ", " : ""}
                          <Link href={u.href} className="hover:text-foreground">
                            {u.title}
                          </Link>
                        </span>
                      ))}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
