import type { Metadata } from "next";
import { PageIntro, Section } from "@/components/site/section";
import { getContent, REVALIDATE } from "@/lib/content";

export const revalidate = REVALIDATE;
export const metadata: Metadata = { title: "Library" };

const STATE = {
  reading: "Reading now",
  finished: "Finished",
  queued: "Up next",
} as const;

export default async function LibraryPage() {
  const { books, bookmarks, notes } = await getContent();
  return (
    <>
      <PageIntro index="01" eyebrow="Library" title="Things I keep">
        Books and reading notes, bookmarks worth returning to, and a notebook of
        ideas.
      </PageIntro>
      <Section index="02" title="Books">
        <div className="grid gap-6 md:grid-cols-3">
          {(Object.keys(STATE) as (keyof typeof STATE)[]).map((s) => (
            <div key={s}>
              <h3 className="tag mb-4">{STATE[s]}</h3>
              <ul className="space-y-6">
                {books
                  .filter((b) => b.state === s)
                  .map((b) => (
                    <li
                      key={b.id}
                      id={b.id}
                      className="border-border lift scroll-mt-24 rounded-2xl border p-5"
                    >
                      <p className="font-serif text-xl leading-snug">
                        {b.title}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {b.author}
                      </p>
                      {b.notes ? (
                        <p className="mt-3 text-sm leading-relaxed">
                          “{b.notes}”
                        </p>
                      ) : null}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
      <Section index="03" title="Bookmarks & resources">
        <ul className="divide-border divide-y">
          {bookmarks.map((b) => (
            <li key={b.id}>
              <a
                href={b.href}
                target="_blank"
                rel="noreferrer"
                className="group grid gap-1 py-4 sm:grid-cols-[1fr_auto]"
              >
                <span>
                  <span className="group-hover:text-primary font-serif text-xl transition-colors">
                    {b.title} ↗
                  </span>
                  <span className="text-muted-foreground block text-sm">
                    {b.description}
                  </span>
                </span>
                <span className="tag">{b.tags.join(" · ")}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
      <Section index="04" title="Notebook">
        <div className="grid gap-10 md:grid-cols-2">
          {(["idea", "engineering"] as const).map((k) => (
            <div key={k}>
              <h3 className="font-serif text-2xl">
                {k === "idea" ? "Future project ideas" : "Engineering notes"}
              </h3>
              <ul className="mt-4 space-y-4">
                {notes
                  .filter((n) => n.kind === k)
                  .map((n) => (
                    <li key={n.id}>
                      <p className="font-medium">{n.title}</p>
                      <p className="text-muted-foreground text-sm">{n.body}</p>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
