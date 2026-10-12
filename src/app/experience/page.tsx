import { seoMeta } from "@/lib/page-meta";
import { Download } from "lucide-react";
import { OpenToWork } from "@/components/site/open-to-work";
import type { Metadata } from "next";
import { ExperienceList } from "@/components/site/experience-list";
import { PageIntro, Section } from "@/components/site/section";
import { SkillsGrid } from "@/components/site/skills-grid";
import { getContent, getT } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  const { resume } = await getContent();
  return seoMeta(
    t("experience.title"),
    resume.summary || t("experience.intro"),
    "/experience",
  );
}

/** Experience + resume in one editorial page. */
export default async function ExperiencePage() {
  const content = await getContent();
  const t = await getT();
  const { site, resume } = content;
  return (
    <>
      <PageIntro
        index="01"
        eyebrow={t("experience.eyebrow")}
        title={t("experience.title")}
      >
        <p className="leading-relaxed">
          {resume.summary || t("experience.intro")}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          {resume.pdfUrl ? (
            <a
              href={resume.pdfUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center rounded-full px-5 font-medium transition-colors"
            >
              <Download className="size-3.5 shrink-0" aria-hidden />
              {t("resume.download").replace(/\s*[↓⬇]\s*$/, "")}
            </a>
          ) : null}
        </div>
        <OpenToWork
          career={site.career}
          resumeUrl={resume.pdfUrl}
          className="mt-10"
        />
      </PageIntro>

      <Section index="02" title={t("resume.experience")} className="py-20">
        <ExperienceList content={content} showHighlights />
      </Section>

      {resume.achievements.length ? (
        <Section index="03" title={t("resume.achievements")} className="py-20">
          <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {resume.achievements.map((a, i) => (
              <li key={a} className="flex gap-5">
                <span className="tag pt-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-serif text-2xl leading-snug">{a}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section index="04" title={t("resume.education")} className="py-20">
        <ul className="space-y-10">
          {resume.education.map((e) => (
            <li
              key={e.school}
              className="grid gap-2 md:grid-cols-[16rem_1fr] md:gap-10"
            >
              <p className="tag pt-2">{e.period}</p>
              <div>
                <h3 className="font-serif text-3xl">{e.school}</h3>
                <p className="text-muted-foreground mt-1 text-lg">
                  {e.degree}
                  {e.detail ? ` · ${e.detail}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section index="05" title={t("resume.skills")} className="py-20">
        <SkillsGrid content={content} />
      </Section>
    </>
  );
}
