"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  type Firestore,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import type { MultiInputOption } from "@/components/ui/multi-input";
import { seed } from "@/content/seed";
import type {
  Bookmark,
  Experience,
  Post,
  Project,
  SiteConfig,
  Skill,
} from "@/content/types";
import type { AdminOptions } from "./fields";

const uniq = (xs: (string | undefined)[]): MultiInputOption[] =>
  [...new Set(xs.map((x) => x?.trim()).filter(Boolean) as string[])]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value }));

async function list<T>(store: Firestore, name: string, fallback: T[]) {
  try {
    const snap = await getDocs(collection(store, name));
    return snap.empty
      ? fallback
      : snap.docs.map((d) => ({ ...(d.data() as T), id: d.id }));
  } catch {
    return fallback;
  }
}

/** Choices for admin multi-selects, from Firestore (all statuses) or seed. */
export function useAdminOptions(store: Firestore, reload: number) {
  const [opts, setOpts] = useState<AdminOptions>({});
  useEffect(() => {
    let live = true;
    (async () => {
      const [projects, posts, experience, bookmarks, skills, siteSnap] =
        await Promise.all([
          list<Project>(store, "projects", seed.projects),
          list<Post>(store, "posts", seed.posts),
          list<Experience>(store, "experience", seed.experience),
          list<Bookmark>(store, "bookmarks", seed.bookmarks),
          list<Skill>(store, "skills", seed.skills),
          getDoc(doc(store, "config", "site")).catch(() => null),
        ]);
      const site = {
        ...seed.site,
        ...((siteSnap?.data() as Partial<SiteConfig>) ?? {}),
      };
      if (!live) return;
      setOpts({
        tech: uniq([
          ...projects.flatMap((p) => p.technologies ?? []),
          ...experience.flatMap((e) => e.skills ?? []),
          ...skills.flatMap((s) => [s.name, ...(s.aliases ?? [])]),
        ]),
        projectSlugs: projects.map((p) => ({ value: p.slug, label: p.title })),
        postSlugs: posts.map((p) => ({ value: p.slug, label: p.title })),
        experienceIds: experience.map((e) => ({
          value: e.id,
          label: `${e.role} · ${e.company}`,
        })),
        postTags: uniq(posts.flatMap((p) => p.tags ?? [])),
        postCategories: uniq(posts.map((p) => p.category)),
        bookmarkTags: uniq(bookmarks.flatMap((b) => b.tags ?? [])),
        skillCategories: uniq([
          ...(site.skillCategories ?? []),
          ...skills.map((s) => s.category),
        ]),
        roles: uniq([
          ...(seed.site.career.roles ?? []),
          ...(site.career?.roles ?? []),
        ]),
      });
    })();
    return () => {
      live = false;
    };
  }, [store, reload]);
  return opts;
}
