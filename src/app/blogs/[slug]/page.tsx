import { IconText } from "@/components/site/icon-text";
import { seoMeta } from "@/lib/page-meta";
import { JsonLd } from "@/components/site/json-ld";
import { abs } from "@/lib/site-url";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/site/markdown";
import { getContent, getT } from "@/lib/content";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getContent()).posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getContent()).posts.find((x) => x.slug === slug);
  return {
    title: p?.title,
    description: p?.excerpt,
    ...seoMeta(p?.title, p?.excerpt, `/blogs/${slug}`),
    ...(p
      ? {
          openGraph: {
            title: p.title,
            description: p.excerpt,
            url: `/blogs/${slug}`,
            type: "article",
            publishedTime: p.date,
            tags: p.tags,
          },
        }
      : {}),
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const p = (await getContent()).posts.find((x) => x.slug === slug);
  if (!p) notFound();
  const t = await getT();
  return (
    <article className="container-x max-w-3xl py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.title,
          description: p.excerpt,
          datePublished: p.date,
          keywords: p.tags.join(", "),
          url: abs(`/blogs/${p.slug}`),
          mainEntityOfPage: abs(`/blogs/${p.slug}`),
          author: { "@id": abs("/#person") },
        }}
      />
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
        <IconText text={t("blogs.back")} />
      </Link>
    </article>
  );
}
