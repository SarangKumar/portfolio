"use client";

import { ExperienceList } from "@/components/site/experience-list";
import {
  BOOK_CARD_CLASS,
  BookCard,
  BookmarkRow,
  PostRow,
} from "@/components/site/content-cards";
import { ProjectCard } from "@/components/site/project-card";
import { seed } from "@/content/seed";
import type {
  Book,
  Bookmark,
  CollectionName,
  Content,
  Experience,
  Post,
  Project,
} from "@/content/types";

type Doc = Record<string, unknown> & { id: string };

/** Collections whose public card can be previewed live. */
export const HAS_CARD: CollectionName[] = [
  "projects",
  "posts",
  "books",
  "bookmarks",
  "experience",
];

/** The real public card for a draft, merged over a seed item so missing fields can't crash it. */
export function CardPreview({
  name,
  item,
}: {
  name: CollectionName;
  item: Doc;
}) {
  const base = (seed[name][0] ?? {}) as Record<string, unknown>;
  const draft = { ...base, ...item, id: item.id || "draft" };
  let card: React.ReactNode = null;
  if (name === "projects") {
    const p = draft as unknown as Project;
    card = (
      <ul>
        <ProjectCard
          project={{
            ...p,
            title: p.title || "Untitled project",
            icon: p.iconData || p.icon,
            technologies: p.technologies ?? [],
          }}
          index={0}
        />
      </ul>
    );
  } else if (name === "posts") {
    const p = draft as unknown as Post;
    card = <PostRow post={{ ...p, title: p.title || "Untitled post" }} />;
  } else if (name === "books") {
    card = (
      <div className={BOOK_CARD_CLASS}>
        <BookCard book={draft as unknown as Book} />
      </div>
    );
  } else if (name === "bookmarks") {
    const b = draft as unknown as Bookmark;
    card = <BookmarkRow bookmark={{ ...b, tags: b.tags ?? [] }} />;
  } else if (name === "experience") {
    const e = draft as unknown as Experience;
    const content = {
      ...seed,
      experience: [
        {
          ...e,
          company: e.company || "Company",
          role: e.role || "Role",
          highlights: e.highlights ?? [],
          skills: e.skills ?? [],
        },
      ],
    } as Content;
    card = <ExperienceList content={content} showHighlights />;
  }
  if (!card) return null;
  return (
    <aside
      aria-label="Live preview"
      className="border-border bg-background flex h-72 flex-col overflow-hidden rounded-2xl border lg:sticky lg:top-6 lg:h-[26rem]"
    >
      <p className="eyebrow border-border shrink-0 border-b px-5 py-3">
        Live preview · as on the site
      </p>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2">{card}</div>
    </aside>
  );
}
