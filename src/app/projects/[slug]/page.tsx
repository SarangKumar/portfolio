import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GitBranch, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project ? { title: project.title, description: project.summary } : {};
}

const caseStudyFields = [
  { key: "problem", label: "Problem" },
  { key: "solution", label: "Solution" },
  { key: "architecture", label: "Architecture" },
  { key: "challenges", label: "Challenges" },
  { key: "decisions", label: "Decisions" },
  { key: "tradeoffs", label: "Trade-offs" },
  { key: "testing", label: "Testing" },
  { key: "performance", label: "Performance" },
  { key: "futureImprovements", label: "Next" },
] as const;

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const fields = caseStudyFields.filter((field) => project[field.key]);

  return (
    <article className="app-container flex flex-col gap-12">
      <Link
        href="/projects"
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" /> All projects
      </Link>

      <PageHeader title={project.title} description={project.summary}>
        <div className="flex flex-wrap gap-2 pt-2">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              <GitBranch /> Source
            </a>
          ) : null}
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({})}
            >
              <ExternalLink /> Live site
            </a>
          ) : null}
        </div>
      </PageHeader>

      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <Badge key={tech} variant="secondary" className="font-normal">
            {tech}
          </Badge>
        ))}
      </div>

      {project.description ? (
        <p className="text-muted-foreground max-w-3xl leading-relaxed">
          {project.description}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field, index) => (
          <Card
            key={field.key}
            className="lift fade-up"
            style={{ "--delay": `${index * 50}ms` } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle className="text-sm">{field.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {project[field.key]}
              </p>
            </CardContent>
          </Card>
        ))}
        {project.sections.map((section, index) => (
          <Card
            key={section.id}
            className="lift fade-up"
            style={
              {
                "--delay": `${(fields.length + index) * 50}ms`,
              } as React.CSSProperties
            }
          >
            <CardHeader>
              <CardTitle className="text-sm">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {section.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </article>
  );
}
