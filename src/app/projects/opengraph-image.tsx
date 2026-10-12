import { getContent, getT } from "@/lib/content";
import { OG_ALT, OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = OG_ALT;
export const revalidate = 60;

export default async function Image() {
  const content = await getContent();
  const t = await getT();
  void t;

  return renderOg({
    eyebrow: content.site.pages.projects.title,
    title: content.site.pages.projects.title,
    subtitle: content.site.pages.projects.intro,
  });
}
