import { IconText } from "@/components/site/icon-text";
import { seoMeta } from "@/lib/page-meta";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DiagramViewer } from "@/components/lab/diagram-viewer";
import { getContent, getT } from "@/lib/content";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getContent()).diagrams.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = (await getContent()).diagrams.find((x) => x.slug === slug);
  return seoMeta(d?.title, d?.summary, `/lab/${slug}`);
}

export default async function DiagramPage({ params }: Props) {
  const { slug } = await params;
  const d = (await getContent()).diagrams.find((x) => x.slug === slug);
  if (!d) notFound();
  const t = await getT();
  return (
    <div className="container-x py-16">
      <Link href="/lab" className="tag link-u">
        <IconText text={t("lab.back")} />
      </Link>
      <h1 className="display mt-6 text-[clamp(2.25rem,8vw,3.75rem)]">
        {d.title}
      </h1>
      <p className="text-muted-foreground mt-4 mb-10 max-w-2xl text-lg">
        {d.summary}
      </p>
      <DiagramViewer diagram={d} />
    </div>
  );
}
