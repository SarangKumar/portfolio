import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Book, Bookmark, Post } from "@/content/types";

/** Blog archive row (also used by the admin live preview). */
export function PostRow({ post: p }: { post: Post }) {
  return (
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
        {[p.kind, p.category, p.date?.slice(5)].filter(Boolean).join(" · ")}
      </span>
    </Link>
  );
}

/** Library book card. */
export function BookCard({ book: b }: { book: Book }) {
  return (
    <>
      <p className="font-serif text-xl leading-snug">{b.title}</p>
      <p className="text-muted-foreground text-sm">{b.author}</p>
      {b.notes ? (
        <p className="mt-3 text-sm leading-relaxed">“{b.notes}”</p>
      ) : null}
    </>
  );
}

export const BOOK_CARD_CLASS =
  "border-border lift scroll-mt-24 rounded-2xl border p-5";

/** Library bookmark row. */
export function BookmarkRow({ bookmark: b }: { bookmark: Bookmark }) {
  return (
    <a
      href={b.href}
      target="_blank"
      rel="noreferrer"
      className="group grid gap-1 py-4 sm:grid-cols-[1fr_auto]"
    >
      <span>
        <span className="group-hover:text-primary-ink inline-flex items-center gap-1.5 font-serif text-xl transition-colors">
          {b.title}
          <ArrowUpRight
            size={16}
            strokeWidth={1.75}
            aria-hidden
            className="shrink-0"
          />
        </span>
        <span className="text-muted-foreground block text-sm">
          {b.description}
        </span>
      </span>
      <span className="tag">{(b.tags ?? []).join(" · ")}</span>
    </a>
  );
}
