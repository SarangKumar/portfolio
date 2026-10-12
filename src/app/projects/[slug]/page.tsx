import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DiagramViewer } from "@/components/lab/diagram-viewer";
import { Markdown } from "@/components/site/markdown";
import { ProjectIcon } from "@/components/site/project-icon";
import { PageIntro, Section, TechTags } from "@/components/site/section";
import { getContent } from "@/lib/content";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { projects } = await getContent();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getContent()).projects.find((x) => x.slug === slug);
  return { title: p?.title ?? "Project", description: p?.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const { projects, diagrams } = await getContent();
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const diagram = diagrams.find((d) => d.slug === p.diagramSlug);
  const sections = [
    { title: "Architecture", body: p.architecture },
    { title: "Implementation", body: p.implementation },
    { title: "Testing", body: p.testing },
    { title: "Trade-offs", body: p.tradeoffs },
    ...p.sections,
  ].filter((s) => s.body);

  return (
    <article>
      <div className="container-x pt-16 sm:pt-24">
        <ProjectIcon
          src={p.icon}
          title={p.title}
          size={88}
          morph={p.slug}
          className="fade-up"
        />
      </div>
      <PageIntro
        compact
        index={p.year}
        eyebrow={`Case study · ${p.kind}`}
        title={p.title}
      >
        <p>{p.summary}</p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          {p.demoUrl ? (
            <a
              href={p.demoUrl}
              className="link-u text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              Live site ↗
            </a>
          ) : null}
          {p.githubUrl ? (
            <a
              href={p.githubUrl}
              className="link-u text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          ) : null}
          {diagram ? (
            <Link
              href={`/lab/${diagram.slug}`}
              className="link-u text-foreground"
            >
              Explore in Architecture Lab →
            </Link>
          ) : null}
        </div>
      </PageIntro>
      <div className="container-x">
        <TechTags items={p.technologies} />
      </div>
      <Section title="Overview">
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
          title="Architecture diagram"
          aside={
            <Link href={`/lab/${diagram.slug}`} className="tag link-u">
              Open in Lab
            </Link>
          }
        >
          <DiagramViewer diagram={diagram} />
        </Section>
      ) : null}
      <div className="container-x">
        <Link href="/projects" className="link-u text-sm">
          ← All projects
        </Link>
      </div>
    </article>
  );
}
