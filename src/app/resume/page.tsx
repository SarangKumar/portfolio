import type { Metadata } from "next";
import { PageIntro, Section } from "@/components/site/section";
import { getContent, getT } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  const { resume } = await getContent();
  return { title: t("resume.eyebrow"), description: resume.summary };
}

export default async function ResumePage() {
  const { resume, site } = await getContent();
  const t = await getT();
  return (
    <>
      <PageIntro
        index="01"
        eyebrow={t("resume.eyebrow")}
        title={t("resume.title")}
      >
        <p>{resume.summary}</p>
        {resume.pdfUrl ? (
          <a
            href={resume.pdfUrl}
            download
            className="link-u text-foreground mt-6 inline-block text-sm"
            target="_blank"
            rel="noreferrer"
          >
            {t("resume.download")}
          </a>
        ) : null}
      </PageIntro>
      <Section index="02" title={t("resume.experience")}>
        <ol className="space-y-12">
          {resume.experience.map((r) => (
            <li
              key={`${r.company}-${r.role}`}
              className="grid gap-3 md:grid-cols-[14rem_1fr]"
            >
              <div>
                <p className="tag">{r.period}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {r.location}
                </p>
              </div>
              <div>
                <h3 className="font-serif text-3xl">{r.role}</h3>
                <p className="text-muted-foreground">{r.company}</p>
                <ul className="text-foreground/85 mt-4 list-disc space-y-2 pl-5 leading-relaxed">
                  {r.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Section>
      {resume.achievements.length ? (
        <Section index="03" title={t("resume.achievements")}>
          <ul className="grid gap-4 md:grid-cols-2">
            {resume.achievements.map((a) => (
              <li
                key={a}
                className="border-border rounded-2xl border p-5 font-serif text-xl leading-snug"
              >
                {a}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      <Section index="04" title={t("resume.education")}>
        <ul className="space-y-6">
          {resume.education.map((e) => (
            <li key={e.school} className="grid gap-2 md:grid-cols-[14rem_1fr]">
              <p className="tag">{e.period}</p>
              <div>
                <h3 className="font-serif text-2xl">{e.school}</h3>
                <p className="text-muted-foreground">
                  {e.degree}
                  {e.detail ? ` · ${e.detail}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <Section index="05" title={t("resume.skills")}>
        <dl className="grid gap-6 md:grid-cols-2">
          {resume.skills.map((g) => (
            <div key={g.group}>
              <dt className="font-medium">{g.group}</dt>
              <dd className="text-muted-foreground mt-1 text-sm">
                {g.items.join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
      <p className="container-x sr-only">{site.name}</p>
    </>
  );
}
