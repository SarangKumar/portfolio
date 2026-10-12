import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DiagramViewer } from "@/components/lab/diagram-viewer";
import { getContent, REVALIDATE } from "@/lib/content";

export const revalidate = REVALIDATE;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getContent()).diagrams.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = (await getContent()).diagrams.find((x) => x.slug === slug);
  return { title: d?.title ?? "Diagram" };
}

export default async function DiagramPage({ params }: Props) {
  const { slug } = await params;
  const d = (await getContent()).diagrams.find((x) => x.slug === slug);
  if (!d) notFound();
  return (
    <div className="container-x py-16">
      <Link href="/lab" className="tag link-u">
        ← Architecture Lab
      </Link>
      <h1 className="display mt-6 text-5xl sm:text-6xl">{d.title}</h1>
      <p className="text-muted-foreground mt-4 mb-10 max-w-2xl text-lg">
        {d.summary}
      </p>
      <DiagramViewer diagram={d} />
    </div>
  );
}
