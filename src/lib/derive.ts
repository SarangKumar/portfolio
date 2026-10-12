import type { Content } from "@/content/types";

export type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  group: "Pages" | "Projects" | "Writing" | "Library" | "Architecture";
  keywords: string;
  icon?: string;
};

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blogs" },
  { href: "/library", label: "Library" },
  { href: "/lab", label: "Architecture Lab" },
  { href: "/board", label: "Public Board" },
] as const;

/** One flat index shared by the ⌘K palette and the terminal. */
export function buildIndex(c: Content): SearchItem[] {
  return [
    ...NAV.map((n) => ({
      id: `nav-${n.href}`,
      title: n.label,
      subtitle: "Page",
      href: n.href,
      group: "Pages" as const,
      keywords: n.label,
    })),
    ...c.projects.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.summary,
      href: `/projects/${p.slug}`,
      group: "Projects" as const,
      keywords: `${p.slug} ${p.technologies.join(" ")}`,
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
      subtitle: `${b.author} · ${b.state}`,
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

/** Skills = curated skills ∪ every technology used by a published project. */
export function deriveSkills(c: Content) {
  const usage = new Map<string, string[]>();
  for (const p of c.projects)
    for (const t of p.technologies)
      usage.set(t, [...(usage.get(t) ?? []), p.title]);
  const names = new Set([...c.skills.map((s) => s.name), ...usage.keys()]);
  return [...names]
    .map((name) => ({
      name,
      category:
        c.skills.find((s) => s.name === name)?.category ?? "From projects",
      projects: usage.get(name) ?? [],
    }))
    .sort(
      (a, b) =>
        b.projects.length - a.projects.length || a.name.localeCompare(b.name),
    );
}
