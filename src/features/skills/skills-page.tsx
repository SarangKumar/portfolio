import { getTranslations } from "next-intl/server";
import { ContentPlaceholder } from "@/components/content/content-placeholder";
import { PageHeader } from "@/components/content/page-header";
import { PageSection } from "@/components/content/page-section";
import { PreviewCard } from "@/components/content/preview-card";
import { RelatedItemList } from "@/components/content/related-item-list";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillCategories, skills } from "@/data/skills";
import {
  experienceForSkill,
  getSkillEvidence,
  isEmptyList,
  projectsForSkill,
  skillsInCategory,
} from "@/lib/content";

export async function SkillsPage() {
  const t = await getTranslations("skills");
  const unpublished = isEmptyList(skills) && isEmptyList(skillCategories);

  return (
    <div className="stack-section">
      <PageHeader title={t("title")} description={t("intro")} />

      {unpublished ? (
        <ContentPlaceholder>{t("placeholder")}</ContentPlaceholder>
      ) : (
        skillCategories.map((category) => {
          const categorySkills = skillsInCategory(category.id, skills);

          return (
            <PageSection
              key={category.id}
              id={category.id}
              title={category.label}
            >
              {isEmptyList(categorySkills) ? (
                <ContentPlaceholder>{t("emptyCategory")}</ContentPlaceholder>
              ) : (
                <div className="grid gap-2 md:grid-cols-2">
                  {categorySkills.map((skill) => {
                    const evidence = getSkillEvidence(skill.id, {
                      skills,
                      experience,
                      projects,
                    });
                    const relatedExperience = experienceForSkill(
                      skill.id,
                      experience,
                    );
                    const relatedProjects = projectsForSkill(
                      skill.id,
                      projects,
                    );
                    const hasEvidence =
                      relatedExperience.length > 0 ||
                      relatedProjects.length > 0;

                    return (
                      <article
                        key={skill.id}
                        id={skill.id}
                        className="scroll-mt-16"
                      >
                        <PreviewCard
                          title={skill.name}
                          description={t("evidence", {
                            roles: evidence.experienceCount,
                            projects: evidence.projectCount,
                          })}
                          action={
                            hasEvidence ? (
                              <div className="stack-compact">
                                <RelatedItemList
                                  items={relatedExperience.map((item) => ({
                                    id: item.id,
                                    label: `${item.role} · ${item.company}`,
                                    href: "/experience",
                                    query: `role=${item.id}`,
                                  }))}
                                  emptyLabel={t("noExperience")}
                                />
                                <RelatedItemList
                                  items={relatedProjects.map((item) => ({
                                    id: item.id,
                                    label: item.title,
                                    href: item.href ?? undefined,
                                  }))}
                                  emptyLabel={t("noProjects")}
                                />
                              </div>
                            ) : (
                              <p className="type-small text-muted-foreground">
                                {t("noEvidence")}
                              </p>
                            )
                          }
                        />
                      </article>
                    );
                  })}
                </div>
              )}
            </PageSection>
          );
        })
      )}
    </div>
  );
}
