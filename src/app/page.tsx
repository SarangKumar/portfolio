import Link from "next/link";
import { BeanBlob } from "@/components/site/bean";
import { ProjectCard } from "@/components/site/project-card";
import { Section } from "@/components/site/section";
import { getContent, getT } from "@/lib/content";
import { deriveSkills } from "@/lib/derive";

export const revalidate = 60;

export default async function Home() {
  const content = await getContent();
  const t = await getT();
  const { site, projects, posts, resume } = content;
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
        <BeanBlob className="top-10 -right-24 h-80 w-[28rem]" />
        <BeanBlob className="bottom-0 -left-32 h-64 w-96 opacity-60" />
        <div className="container-x relative pt-20 pb-16 sm:pt-32">
          <p className="eyebrow fade-up">
            01/ {t("home.from", { location: site.location })}
          </p>
          <h1
            className="display fade-up mt-6 text-6xl sm:text-8xl lg:text-9xl"
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
          <div
            className="fade-up mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm"
            style={{ ["--delay" as string]: "240ms" }}
          >
            <span className="chip">
              <span
                className={`bean size-2 ${site.career.available ? "bg-emerald-500" : "bg-muted-foreground"}`}
              />
              {site.career.label}
            </span>
            <span className="text-muted-foreground">{site.career.detail}</span>
            <Link href="/projects" className="link-u">
              {t("home.cta")}
            </Link>
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

      {site.homeSections.resume && resume.experience.length ? (
        <Section
          index={idx()}
          title={t("home.resume")}
          aside={
            <Link href={site.resumeHref} className="tag link-u">
              {t("home.fullResume")}
            </Link>
          }
        >
          <ul className="divide-border divide-y">
            {resume.experience.map((r) => (
              <li
                key={`${r.company}-${r.role}`}
                className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline"
              >
                <span>
                  <span className="block font-serif text-2xl">{r.role}</span>
                  <span className="text-muted-foreground text-sm">
                    {r.company}
                  </span>
                </span>
                <span className="tag">{r.period}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {site.homeSections.focus && site.currentFocus.length ? (
        <Section index={idx()} title={t("home.focus")}>
          <ol className="grid gap-6 md:grid-cols-3">
            {site.currentFocus.map((f, i) => (
              <li key={f} className="border-border lift rounded-2xl border p-6">
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
