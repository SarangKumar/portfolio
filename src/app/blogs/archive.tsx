"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "@/content/types";
import { cn } from "@/lib/utils";
import { useT } from "@/components/site/labels-provider";

export function Archive({ posts }: { posts: Post[] }) {
  const t = useT();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const categories = useMemo(
    () => [...new Set(posts.map((p) => p.category))],
    [posts],
  );
  const tags = useMemo(
    () => [...new Set(posts.flatMap((p) => p.tags))].sort(),
    [posts],
  );
  const shown = posts.filter(
    (p) =>
      (!category || p.category === category) &&
      (!tag || p.tags.includes(tag)) &&
      `${p.title} ${p.excerpt} ${p.body} ${p.tags.join(" ")}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  const byYear = shown.reduce<Record<string, Post[]>>(
    (acc, p) => ((acc[p.date.slice(0, 4)] ??= []).push(p), acc),
    {},
  );

  const pill = (active: boolean) =>
    cn(
      "chip cursor-pointer transition-colors",
      active && "border-primary text-foreground bg-primary/10",
    );

  return (
    <div className="container-x">
      <div className="flex flex-col gap-4">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("blogs.search")}
          aria-label="Search posts"
          className="border-border focus:border-primary w-full border-b bg-transparent py-3 font-serif text-2xl outline-none"
        />
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Categories"
        >
          <button
            className={pill(!category)}
            onClick={() => setCategory(null)}
            aria-pressed={!category}
          >
            {t("blogs.all")}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={pill(category === c)}
              onClick={() => setCategory(category === c ? null : c)}
              aria-pressed={category === c}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tags">
          {tags.map((t) => (
            <button
              key={t}
              className={pill(tag === t)}
              onClick={() => setTag(tag === t ? null : t)}
              aria-pressed={tag === t}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>
      {Object.keys(byYear).length === 0 ? (
        <p className="text-muted-foreground py-16">{t("blogs.empty")}</p>
      ) : null}
      {Object.entries(byYear)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([year, list]) => (
          <section key={year} className="mt-12">
            <h2 className="eyebrow border-border border-t pt-4">{year}</h2>
            <ul className="divide-border divide-y">
              {list.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/blogs/${p.slug}`}
                    className="group grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:gap-6"
                  >
                    <span>
                      <span className="group-hover:text-primary-ink block font-serif text-2xl transition-colors">
                        {p.title}
                      </span>
                      <span className="text-muted-foreground mt-1 block text-sm">
                        {p.excerpt}
                      </span>
                    </span>
                    <span className="tag">
                      {p.kind} · {p.category} · {p.date.slice(5)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
