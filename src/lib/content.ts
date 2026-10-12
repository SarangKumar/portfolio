import { cache } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { seed, seedComments } from "@/content/seed";
import {
  COLLECTIONS,
  type Comment,
  type Content,
  type SiteConfig,
} from "@/content/types";
import { db } from "./firebase/client";
import { label } from "./labels";

/** Seconds between background re-renders when Firestore is the source. */
export const REVALIDATE = 60;

/** Firestore site config layered over seed, so new keys always have a value. */
function mergeSite(remote: Partial<SiteConfig>): SiteConfig {
  const base = seed.site;
  return {
    ...base,
    ...remote,
    seo: { ...base.seo, ...remote.seo },
    career: { ...base.career, ...remote.career },
    homeSections: { ...base.homeSections, ...remote.homeSections },
    pages: { ...base.pages, ...remote.pages },
    labels: { ...base.labels, ...remote.labels },
    nav: remote.nav?.length ? remote.nav : base.nav,
  };
}

async function fromFirestore(): Promise<Content | null> {
  const store = db();
  if (!store) return null;
  try {
    const siteSnap = await getDoc(doc(store, "config", "site"));
    const result = { ...seed } as Content;
    if (siteSnap.exists())
      result.site = mergeSite(siteSnap.data() as Partial<SiteConfig>);
    await Promise.all(
      COLLECTIONS.map(async (name) => {
        const snap = await getDocs(
          query(collection(store, name), where("status", "==", "published")),
        );
        if (!snap.empty) {
          (result as Record<string, unknown>)[name] = snap.docs.map((d) => ({
            ...d.data(),
            id: d.id,
          }));
        }
      }),
    );
    return result;
  } catch (error) {
    console.warn("[content] Firestore unavailable, using seed content.", error);
    return null;
  }
}

/** Published content: Firestore when configured, seed otherwise. */
export const getContent = cache(async (): Promise<Content> => {
  const remote = await fromFirestore();
  const c = remote ?? seed;
  const pub = <T extends { status: string }>(xs: T[]) =>
    xs.filter((x) => x.status === "published");
  return {
    site: c.site,
    projects: pub(c.projects).sort((a, b) => a.order - b.order),
    posts: pub(c.posts).sort((a, b) => b.date.localeCompare(a.date)),
    books: pub(c.books),
    bookmarks: pub(c.bookmarks),
    notes: pub(c.notes),
    skills: pub(c.skills),
    diagrams: pub(c.diagrams),
  };
});

export async function getApprovedComments(): Promise<Comment[]> {
  const store = db();
  if (!store) return seedComments;
  try {
    const snap = await getDocs(
      query(collection(store, "comments"), where("status", "==", "approved")),
    );
    return snap.docs
      .map((d) => ({ ...(d.data() as Omit<Comment, "id">), id: d.id }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

/** Server-side label lookup bound to the current site config. */
export async function getT() {
  const { site } = await getContent();
  return (key: string, vars?: Record<string, string | number>) =>
    label(site.labels, key, vars);
}
