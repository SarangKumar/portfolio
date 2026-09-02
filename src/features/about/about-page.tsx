import { getTranslations } from "next-intl/server";
import { ContentPlaceholder } from "@/components/content/content-placeholder";
import { PageHeader } from "@/components/content/page-header";
import { PageSection } from "@/components/content/page-section";
import { RelatedItemList } from "@/components/content/related-item-list";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { hasAboutContent, isEmptyList, skillsByIds } from "@/lib/content";

export async function AboutPage() {
  const t = await getTranslations("about");
  const hasContent = hasAboutContent(profile);
  const focus = skillsByIds(profile.focusSkillIds, skills);
  const expertise = skillsByIds(profile.expertiseSkillIds, skills);

  return (
    <div className="stack-section">
      <PageHeader title={t("title")} description={t("intro")} />

      <PageSection id="background" title={t("background.title")}>
        {profile.background ? (
          <p className="max-w-prose type-body text-muted-foreground">
            {profile.background}
          </p>
        ) : (
          <ContentPlaceholder>{t("background.placeholder")}</ContentPlaceholder>
        )}
      </PageSection>

      <PageSection id="philosophy" title={t("philosophy.title")}>
        {profile.philosophy ? (
          <p className="max-w-prose type-body text-muted-foreground">
            {profile.philosophy}
          </p>
        ) : (
          <ContentPlaceholder>{t("philosophy.placeholder")}</ContentPlaceholder>
        )}
      </PageSection>

      <PageSection id="focus" title={t("focus.title")}>
        {isEmptyList(focus) ? (
          <ContentPlaceholder>{t("focus.placeholder")}</ContentPlaceholder>
        ) : (
          <RelatedItemList
            items={focus.map((skill) => ({
              id: skill.id,
              label: skill.name,
              href: "/skills",
              fragment: skill.id,
            }))}
            emptyLabel={t("focus.placeholder")}
          />
        )}
      </PageSection>

      <PageSection id="expertise" title={t("expertise.title")}>
        {isEmptyList(expertise) ? (
          <ContentPlaceholder>{t("expertise.placeholder")}</ContentPlaceholder>
        ) : (
          <RelatedItemList
            items={expertise.map((skill) => ({
              id: skill.id,
              label: skill.name,
              href: "/skills",
              fragment: skill.id,
            }))}
            emptyLabel={t("expertise.placeholder")}
          />
        )}
      </PageSection>

      <PageSection id="interests" title={t("interests.title")}>
        {isEmptyList(profile.interests) ? (
          <ContentPlaceholder>{t("interests.placeholder")}</ContentPlaceholder>
        ) : (
          <RelatedItemList
            items={profile.interests.map((interest) => ({
              id: interest,
              label: interest,
            }))}
            emptyLabel={t("interests.placeholder")}
          />
        )}
      </PageSection>

      {!hasContent ? (
        <p className="type-small text-muted-foreground">{t("unpublished")}</p>
      ) : null}
    </div>
  );
}
