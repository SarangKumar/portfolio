import type { Metadata } from "next";
import { PageIntro } from "@/components/site/section";
import { getApprovedComments, REVALIDATE } from "@/lib/content";
import { CommentForm } from "./comment-form";

export const revalidate = REVALIDATE;
export const metadata: Metadata = { title: "Public Board" };

export default async function BoardPage() {
  const comments = await getApprovedComments();
  return (
    <>
      <PageIntro index="01" eyebrow="Public Board" title="Say hello">
        Leave a note, a question or feedback. Everything is read and approved by
        hand before it appears here.
      </PageIntro>
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_24rem]">
        <ul className="space-y-6">
          {comments.length === 0 ? (
            <li className="text-muted-foreground">
              No notes yet — be the first.
            </li>
          ) : null}
          {comments.map((c) => (
            <li key={c.id} className="border-border border-b pb-6">
              <p className="font-serif text-2xl leading-snug">“{c.message}”</p>
              <p className="tag mt-3">
                {c.name} · {c.createdAt.slice(0, 10)}
              </p>
            </li>
          ))}
        </ul>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <CommentForm />
        </div>
      </div>
    </>
  );
}
