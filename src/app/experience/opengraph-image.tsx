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
    eyebrow: t("experience.title"),
    title: `${content.experience[0]?.role ?? content.site.role}${content.experience[0] ? ` @ ${content.experience[0].company}` : ""}`,
    subtitle: content.resume.summary,
  });
}
