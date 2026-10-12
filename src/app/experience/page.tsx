import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceList } from "@/components/site/experience-list";
import { PageIntro } from "@/components/site/section";
import { getContent, getT } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("experience.title"), description: t("experience.intro") };
}

export default async function ExperiencePage() {
  const content = await getContent();
  const t = await getT();
  const { site } = content;
  return (
    <>
      <PageIntro
        index="01"
        eyebrow={t("experience.eyebrow")}
        title={t("experience.title")}
      >
        <p>{t("experience.intro")}</p>
        <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="chip">
            <span
              className={`bean size-2 ${site.career.available ? "bg-emerald-500" : "bg-muted-foreground"}`}
            />
            {site.career.label}
          </span>
          <Link href={site.resumeHref} className="link-u text-foreground">
            {t("experience.resume")}
          </Link>
        </p>
      </PageIntro>
      <div className="container-x">
        <ExperienceList content={content} />
      </div>
    </>
  );
}
