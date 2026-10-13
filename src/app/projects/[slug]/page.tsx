import { IconText } from "@/components/site/icon-text";
import { seoMeta } from "@/lib/page-meta";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DiagramViewer } from "@/components/lab/diagram-viewer";
import { Markdown } from "@/components/site/markdown";
import { JsonLd } from "@/components/site/json-ld";
import { abs } from "@/lib/site-url";
import { ProjectIcon } from "@/components/site/project-icon";
import { PageIntro, Section, TechTags } from "@/components/site/section";
import { getContent, getT } from "@/lib/content";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { projects } = await getContent();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getContent()).projects.find((x) => x.slug === slug);
  return seoMeta(p?.title, p?.summary, `/projects/${slug}`);
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const { projects, diagrams } = await getContent();
  const t = await getT();
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const diagram = diagrams.find((d) => d.slug === p.diagramSlug);
  const sections = [
    { title: t("project.architecture"), body: p.architecture },
    { title: t("project.implementation"), body: p.implementation },
    { title: t("project.testing"), body: p.testing },
    { title: t("project.tradeoffs"), body: p.tradeoffs },
    ...p.sections,
  ].filter((s) => s.body);

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": p.githubUrl ? "SoftwareSourceCode" : "CreativeWork",
          name: p.title,
          description: p.summary,
          url: abs(`/projects/${p.slug}`),
          dateCreated: p.year,
          keywords: p.technologies.join(", "),
          creator: { "@id": abs("/#person") },
          ...(p.githubUrl
            ? {
                codeRepository: p.githubUrl,
                programmingLanguage: p.technologies,
              }
            : {}),
          ...(p.demoUrl ? { sameAs: p.demoUrl } : {}),
        }}
      />
      <div className="container-x pt-16 sm:pt-24">
        <ProjectIcon
          src={p.icon}
          title={p.title}
          size={88}
          className="fade-up"
          morph={p.slug}
        />
      </div>
      <PageIntro
        compact
        index={p.year}
        eyebrow={t("project.eyebrow", {
          kind: p.statusLabel || t(`project.kind.${p.kind}`),
        })}
        title={p.title}
      >
        <p>{p.summary}</p>
        {p.installCommand ? (
          <pre className="border-border bg-muted/40 mt-6 overflow-x-auto rounded-lg border px-4 py-3 font-mono text-xs sm:text-sm">
            <code>
              <span aria-hidden className="text-primary-ink select-none">
                ${" "}
              </span>
              {p.installCommand}
            </code>
          </pre>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          {p.demoUrl ? (
            <a
              href={p.demoUrl}
              className="link-u text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              <IconText text={t("project.live")} />
            </a>
          ) : null}
          {p.githubUrl ? (
            <a
              href={p.githubUrl}
              className="link-u text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              <IconText text={t("project.source")} />
            </a>
          ) : null}
          {diagram ? (
            <Link
              href={`/lab/${diagram.slug}`}
              className="link-u text-foreground"
            >
              <IconText text={t("project.exploreLab")} />
            </Link>
          ) : null}
        </div>
      </PageIntro>
      <div className="container-x">
        <TechTags items={p.technologies} />
      </div>
      <Section title={t("project.overview")}>
        <p className="max-w-3xl text-lg leading-relaxed">{p.description}</p>
      </Section>
      {sections.map((s, i) => (
        <Section
          key={s.title}
          index={String(i + 1).padStart(2, "0")}
          title={s.title}
        >
          <div className="max-w-3xl">
            <Markdown source={s.body} />
          </div>
        </Section>
      ))}
      {diagram ? (
        <Section
          title={t("project.diagram")}
          aside={
            <Link href={`/lab/${diagram.slug}`} className="tag link-u">
              {t("project.openLab")}
            </Link>
          }
        >
          <DiagramViewer diagram={diagram} />
        </Section>
      ) : null}
      <div className="container-x">
        <Link href="/projects" className="link-u text-sm">
          <IconText text={t("project.back")} />
        </Link>
      </div>
    </article>
  );
}
