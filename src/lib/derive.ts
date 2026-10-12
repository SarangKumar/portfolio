import type { Content } from "@/content/types";
import { label } from "./labels";

export type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  group: "Pages" | "Projects" | "Writing" | "Library" | "Architecture";
  keywords: string;
  icon?: string;
};

/** One flat index shared by the ⌘K palette and the terminal. */
export function buildIndex(c: Content): SearchItem[] {
  const pageLabel = (href: string) =>
    c.site.nav.find((n) => n.href === href)?.label ?? href;
  return [
    ...[...c.site.nav, ...c.site.footerNav].map((n) => ({
      id: `nav-${n.href}`,
      title: n.label,
      subtitle: n.href,
      href: n.href,
      group: "Pages" as const,
      keywords: n.label,
    })),
    ...c.experience.map((e) => ({
      id: e.id,
      title: `${e.role} · ${e.company}`,
      subtitle: e.employmentType,
      href: `${c.site.experienceHref}#${e.id}`,
      group: "Pages" as const,
      keywords: `${e.company} ${e.skills.join(" ")}`,
    })),
    ...c.projects.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.summary,
      href: `/projects/${p.slug}`,
      group: "Projects" as const,
      keywords: `${p.slug} ${p.technologies.join(" ")} ${pageLabel("/projects")}`,
      icon: p.icon,
    })),
    ...c.posts.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: `${p.kind} · ${p.category}`,
      href: `/blogs/${p.slug}`,
      group: "Writing" as const,
      keywords: `${p.slug} ${p.tags.join(" ")} ${p.excerpt}`,
    })),
    ...c.books.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: `${b.author} · ${label(c.site.labels, `library.${b.state}`)}`,
      href: `/library#${b.id}`,
      group: "Library" as const,
      keywords: b.author,
    })),
    ...c.bookmarks.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.description,
      href: b.href,
      group: "Library" as const,
      keywords: b.tags.join(" "),
    })),
    ...c.diagrams.map((d) => ({
      id: d.id,
      title: d.title,
      subtitle: d.summary,
      href: `/lab/${d.slug}`,
      group: "Architecture" as const,
      keywords: d.slug,
    })),
  ];
}

export type DerivedSkill = {
  name: string;
  category: string;
  proficiency: string;
  featured: boolean;
  order: number;
  projects: { title: string; href: string }[];
  experience: { title: string; href: string }[];
};

/**
 * Skills view: every technology used by a published project or experience
 * role, resolved through the admin-managed `skills` collection (name/alias
 * match → rename/merge; hidden → dropped; category/order/flags → grouping).
 * Technologies with no matching skill (name/alias) are not shown — add a skill
 * or alias in /admin to surface them.
 */
export function deriveSkills(c: Content) {
  const byKey = new Map<string, Content["skills"][number]>();
  for (const s of c.skills)
    for (const k of [s.name, ...(s.aliases ?? [])])
      byKey.set(k.toLowerCase(), s);
  const out = new Map<string, DerivedSkill>();
  const hidden = new Set<string>();
  const touch = (raw: string) => {
    const s = byKey.get(raw.toLowerCase());
    if (!s) return null;
    if (s.hidden) {
      hidden.add(s.name);
      return null;
    }
    const name = s.name;
    if (!out.has(name))
      out.set(name, {
        name,
        category: s.category,
        proficiency: s.proficiency ?? "",
        featured: Boolean(s.featured),
        order: s.order ?? 999,
        projects: [],
        experience: [],
      });
    return out.get(name)!;
  };
  const addOnce = (
    list: { title: string; href: string }[],
    item: { title: string; href: string },
  ) => {
    if (!list.some((x) => x.href === item.href)) list.push(item);
  };
  for (const p of c.projects)
    for (const t of p.technologies) {
      const d = touch(t);
      if (d)
        addOnce(d.projects, { title: p.title, href: `/projects/${p.slug}` });
    }
  for (const e of c.experience)
    for (const t of e.skills) {
      const d = touch(t);
      if (d)
        addOnce(d.experience, {
          title: e.company,
          href: `${c.site.experienceHref}#${e.id}`,
        });
    }
  for (const s of c.skills) {
    if (s.hidden || hidden.has(s.name)) continue;
    const d = touch(s.name);
    if (!d) continue;
    for (const slug of s.projects ?? []) {
      const p = c.projects.find((x) => x.slug === slug);
      if (p)
        addOnce(d.projects, { title: p.title, href: `/projects/${p.slug}` });
    }
    for (const id of s.experience ?? []) {
      const e = c.experience.find((x) => x.id === id);
      if (e)
        addOnce(d.experience, {
          title: e.company,
          href: `${c.site.experienceHref}#${e.id}`,
        });
    }
  }
  return [...out.values()].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      a.order - b.order ||
      b.projects.length +
        b.experience.length -
        (a.projects.length + a.experience.length) ||
      a.name.localeCompare(b.name),
  );
}

/** Group skills by category in the configured order. */
export function groupSkills(c: Content, skills: DerivedSkill[]) {
  const cats = [...new Set(skills.map((s) => s.category))];
  const rank = (x: string) => {
    const i = c.site.skillCategories.indexOf(x);
    return i < 0 ? 999 : i;
  };
  return cats
    .sort((a, b) => rank(a) - rank(b))
    .map((category) => ({
      category,
      skills: skills.filter((s) => s.category === category),
    }));
}

/** Inclusive month count between YYYY-MM strings (end empty = now). */
export function monthsBetween(start: string, end: string) {
  const [sy, sm] = start.split("-").map(Number);
  const now = new Date();
  const [ey, em] = end
    ? end.split("-").map(Number)
    : [now.getFullYear(), now.getMonth() + 1];
  return Math.max(1, (ey - sy) * 12 + (em - sm) + 1);
}

export function formatDuration(labels: Record<string, string>, months: number) {
  const y = Math.floor(months / 12),
    m = months % 12;
  const parts = [];
  if (y)
    parts.push(
      label(labels, y === 1 ? "duration.yr" : "duration.yrs", { n: y }),
    );
  if (m)
    parts.push(
      label(labels, m === 1 ? "duration.mo" : "duration.mos", { n: m }),
    );
  return parts.join(" ");
}

export function formatMonth(ym: string) {
  if (!ym) return "";
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** LinkedIn-style: roles grouped under each company, newest first. */
export function groupExperience(c: Content) {
  const groups: {
    company: string;
    companyUrl: string;
    location: string;
    workplace: string;
    roles: Content["experience"];
    months: number;
  }[] = [];
  for (const e of c.experience) {
    let g = groups.find((x) => x.company === e.company);
    if (!g)
      groups.push(
        (g = {
          company: e.company,
          companyUrl: e.companyUrl,
          location: e.location,
          workplace: e.workplace,
          roles: [],
          months: 0,
        }),
      );
    g.roles.push(e);
  }
  for (const g of groups) {
    const start = g.roles.map((r) => r.start).sort()[0];
    const ongoing = g.roles.some((r) => !r.end);
    const end = ongoing
      ? ""
      : g.roles
          .map((r) => r.end)
          .sort()
          .at(-1)!;
    g.months = monthsBetween(start, end);
  }
  return groups;
}
