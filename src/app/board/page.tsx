import { PageIntro } from "@/components/site/section";
import { getApprovedComments, getContent, getT } from "@/lib/content";
import { pageMetadata } from "@/lib/page-meta";
import { CommentForm } from "./comment-form";

export const revalidate = 60;
export const generateMetadata = () => pageMetadata("board");

export default async function BoardPage() {
  const [comments, { site }, t] = await Promise.all([
    getApprovedComments(),
    getContent(),
    getT(),
  ]);
  const page = site.pages.board;
  return (
    <>
      <PageIntro index="01" eyebrow={page.eyebrow} title={page.title}>
        {page.intro}
      </PageIntro>
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_24rem]">
        <ul className="space-y-6">
          {comments.length === 0 ? (
            <li className="text-muted-foreground">{t("board.empty")}</li>
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
