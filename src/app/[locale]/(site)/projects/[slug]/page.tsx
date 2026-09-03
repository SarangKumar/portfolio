import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProjectDetail } from "@/components/content/project-detail";
import { ProjectJsonLd } from "@/components/content/project-json-ld";
import {
  getPublishedProjectBySlug,
  getPublishedProjects,
  getPublishedSkills,
} from "@/content/public";
import { activateLocale } from "@/lib/locale-page";
import { projectCanonicalUrl, projectMetadata } from "@/lib/project-metadata";

type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  await activateLocale(locale);

  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return projectMetadata(project);
}

export default async function Page({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  await activateLocale(locale);

  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const t = await getTranslations("projects");
  const { skills } = await getPublishedSkills();

  return (
    <>
      <ProjectJsonLd
        project={project}
        canonicalUrl={projectCanonicalUrl(project.slug)}
      />
      <ProjectDetail
        project={project}
        skills={skills}
        copy={{
          technologies: t("technologies"),
          skills: t("skills"),
          media: t("media"),
          sourceCode: t("sourceCode"),
          liveDemo: t("liveDemo"),
          noSkills: t("noSkills"),
          sections: {
            description: t("sections.description"),
            architecture: t("sections.architecture"),
            problem: t("sections.problem"),
            solution: t("sections.solution"),
            challenges: t("sections.challenges"),
            decisions: t("sections.decisions"),
            tradeoffs: t("sections.tradeoffs"),
            testing: t("sections.testing"),
            performance: t("sections.performance"),
            futureImprovements: t("sections.futureImprovements"),
          },
        }}
      />
    </>
  );
}
