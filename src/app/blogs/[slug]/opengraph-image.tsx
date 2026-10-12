import { getContent, getT } from "@/lib/content";
import { OG_ALT, OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = OG_ALT;
export const revalidate = 60;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const content = await getContent();
  const t = await getT();
  void t;
  const { slug } = await params;
  const p = content.posts.find((x) => x.slug === slug);
  return renderOg({
    eyebrow: p ? `${p.kind} · ${p.category}` : "Writing",
    title: p?.title ?? "Writing",
    subtitle: p?.excerpt,
  });
}
