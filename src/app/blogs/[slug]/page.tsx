import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/site/markdown";
import { getContent } from "@/lib/content";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getContent()).posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getContent()).posts.find((x) => x.slug === slug);
  return { title: p?.title ?? "Post", description: p?.excerpt };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const p = (await getContent()).posts.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <article className="container-x max-w-3xl py-20">
      <p className="eyebrow">
        {p.kind} · {p.category} · {p.date}
      </p>
      <h1 className="display mt-4 text-5xl sm:text-6xl">{p.title}</h1>
      <p className="text-muted-foreground mt-6 text-xl">{p.excerpt}</p>
      <div className="mt-10">
        <Markdown source={p.body} />
      </div>
      <p className="tag mt-12">{p.tags.map((t) => `#${t}`).join("  ")}</p>
      <Link href="/blogs" className="link-u mt-8 inline-block text-sm">
        ← Archive
      </Link>
    </article>
  );
}
