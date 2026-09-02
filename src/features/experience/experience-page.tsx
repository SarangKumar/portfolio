import { getLocale, getTranslations } from "next-intl/server";
import { ContentPlaceholder } from "@/components/content/content-placeholder";
import { PageHeader } from "@/components/content/page-header";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { ExperienceTimeline } from "@/features/experience/experience-timeline";
import { isEmptyList, projectsForExperience, skillsByIds } from "@/lib/content";
import { formatExperiencePeriod } from "@/lib/dates";

export async function ExperiencePage({ selectedId }: { selectedId?: string }) {
  const t = await getTranslations("experience");
  const locale = await getLocale();

  const items = experience.map((item) => ({
    id: item.id,
    company: item.company,
    role: item.role,
    startDate: item.startDate,
    endDate: item.endDate,
    periodLabel: formatExperiencePeriod(
      item.startDate,
      item.endDate,
      locale,
      t("present"),
    ),
    description: item.description,
    technologies: skillsByIds(item.skillIds, skills).map((skill) => ({
      id: skill.id,
      label: skill.name,
      href: "/skills" as const,
      fragment: skill.id,
    })),
    projects: projectsForExperience(item.id, experience, projects).map(
      (project) => ({
        id: project.id,
        label: project.title,
        projectSlug: project.slug,
      }),
    ),
    achievements: item.achievements,
  }));

  return (
    <div className="stack-section">
      <PageHeader title={t("title")} description={t("intro")} />

      {isEmptyList(experience) ? (
        <ContentPlaceholder>{t("placeholder")}</ContentPlaceholder>
      ) : (
        <ExperienceTimeline
          items={items}
          initialSelectedId={selectedId}
          copy={{
            groupBy: t("groupBy"),
            byTime: t("byTime"),
            byCompany: t("byCompany"),
            byRole: t("byRole"),
            timeline: t("timeline"),
            details: t("details"),
            technologies: t("technologies"),
            projects: t("projects"),
            achievements: t("achievements"),
            noRelated: t("noRelated"),
            noDescription: t("noDescription"),
            noAchievements: t("noAchievements"),
          }}
        />
      )}
    </div>
  );
}
