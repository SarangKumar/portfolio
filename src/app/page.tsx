import { HeroRobot } from "@/components/site/hero-robot";
import { Download } from "lucide-react";
import { OpenToWork } from "@/components/site/open-to-work";
import Link from "next/link";
import { BeanBlob } from "@/components/site/bean";
import { ExperienceList } from "@/components/site/experience-list";
import { ProjectCard } from "@/components/site/project-card";
import { Section } from "@/components/site/section";
import { getContent, getT } from "@/lib/content";
import { deriveSkills } from "@/lib/derive";

export const revalidate = 60;

export default async function Home() {
  const content = await getContent();
  const t = await getT();
  const { site, projects, posts } = content;
  const featured = site.featuredProjectSlugs.length
    ? site.featuredProjectSlugs
        .map((s) => projects.find((p) => p.slug === s))
        .filter((p) => p !== undefined)
    : projects.slice(0, 3);
  const writing = site.featuredPostSlugs.length
    ? site.featuredPostSlugs
        .map((s) => posts.find((p) => p.slug === s))
        .filter((p) => p !== undefined)
    : posts.slice(0, 3);
  const skills = deriveSkills(content);
  let n = 1;
  const idx = () => String(++n).padStart(2, "0");

  return (
    <>
      <section className="relative overflow-hidden">
        <BeanBlob className="top-10 -right-24 h-80 w-[28rem]" speed={-0.35} />
        <BeanBlob
          className="bottom-0 -left-32 h-64 w-96 opacity-60"
          speed={0.25}
        />
        <div
          data-parallax="-0.15"
          data-parallax-max="48"
          className="container-x relative grid items-center gap-10 pt-20 pb-16 sm:pt-32 lg:grid-cols-[minmax(0,1fr)_auto]"
        >
          <div className="min-w-0">
            <p className="eyebrow fade-up">
              01/ {t("home.from", { location: site.location })}
            </p>
            <h1
              className="display fade-up mt-6 text-6xl sm:text-8xl xl:text-9xl"
              style={{ ["--delay" as string]: "80ms" }}
            >
              {site.role}
            </h1>
            <p
              className="fade-up mt-6 max-w-xl text-xl sm:text-2xl"
              style={{ ["--delay" as string]: "160ms" }}
            >
              {site.tagline}
            </p>
            <OpenToWork
              career={site.career}
              resumeUrl={content.resume.pdfUrl}
              className="fade-up mt-8"
            />
            <div
              className="fade-up mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm"
              style={{ ["--delay" as string]: "240ms" }}
            >
              <Link href="/projects" className="link-u">
                {t("home.cta")}
              </Link>
            </div>
          </div>
          <div
            aria-hidden={false}
            data-parallax="0.12"
            data-parallax-max="40"
            className="fade-up hidden justify-center py-10 lg:flex"
            style={{ ["--delay" as string]: "320ms" }}
          >
            <HeroRobot size={300} />
          </div>
        </div>
        {site.homeSections.skills ? (
          <div
            className="border-border overflow-hidden border-y py-3"
            aria-hidden
          >
            <div className="marquee tag flex w-max gap-8 whitespace-nowrap">
              {[...skills, ...skills].map((s, i) => (
                <span key={i}>{s.name} •</span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <Section index={idx()} title={t("home.about")}>
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <p className="display text-3xl">{site.name}</p>
          <div className="text-foreground/85 space-y-4 text-lg leading-relaxed">
            <p>{site.intro}</p>
            <p className="text-muted-foreground">{site.about}</p>
          </div>
        </div>
      </Section>

      {site.homeSections.featured && featured.length ? (
        <Section
          index={idx()}
          title={t("home.featured")}
          aside={
            <Link href="/projects" className="tag link-u">
              {t("home.allProjects")}
            </Link>
          }
        >
          <div className="border-border border-t">
            {featured.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </Section>
      ) : null}

      {site.homeSections.experience && content.experience.length ? (
        <Section
          index={idx()}
          title={t("home.resume")}
          aside={
            <span className="flex flex-wrap gap-x-4 gap-y-2 whitespace-nowrap">
              <Link href={site.experienceHref} className="tag link-u">
                {t("experience.all")}
              </Link>
              {site.homeSections.resume && content.resume.pdfUrl ? (
                <a
                  href={content.resume.pdfUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="tag link-u inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Download className="size-3.5 shrink-0" aria-hidden />
                  {t("resume.download").replace(/\s*[↓⬇]\s*$/, "")}
                </a>
              ) : null}
            </span>
          }
        >
          {content.resume.summary ? (
            <p className="text-foreground/85 mb-10 max-w-3xl text-lg leading-relaxed">
              {content.resume.summary}
            </p>
          ) : null}
          <ExperienceList content={content} compact />
        </Section>
      ) : null}

      {site.homeSections.focus && site.currentFocus.length ? (
        <Section index={idx()} title={t("home.focus")}>
          <ol className="grid gap-6 md:grid-cols-3">
            {site.currentFocus.map((f, i) => (
              <li
                key={f}
                data-parallax={-0.04 * ((i % 3) + 1)}
                data-parallax-max="24"
                className="border-border lift rounded-2xl border p-6"
              >
                <span className="tag">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-6 font-serif text-2xl leading-snug">{f}</p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {site.homeSections.writing && writing.length ? (
        <Section
          index={idx()}
          title={t("home.writing")}
          aside={
            <Link href="/blogs" className="tag link-u">
              {t("home.archive")}
            </Link>
          }
        >
          <ul className="divide-border divide-y">
            {writing.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/blogs/${p.slug}`}
                  className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span className="group-hover:text-primary font-serif text-2xl transition-colors">
                    {p.title}
                  </span>
                  <span className="tag">
                    {p.category} · {p.date}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
