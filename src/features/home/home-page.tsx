import { getLocale, getTranslations } from "next-intl/server";
import { ArticleGrid } from "@/components/content/article-grid";
import { ContentPlaceholder } from "@/components/content/content-placeholder";
import { CtaBanner } from "@/components/content/cta-banner";
import { PageSection } from "@/components/content/page-section";
import { PreviewCard } from "@/components/content/preview-card";
import { ProjectGrid } from "@/components/content/project-grid";
import { ButtonLink } from "@/components/ui/button-link";
import { posts } from "@/data/blog";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projectViewCounts } from "@/data/project-popularity";
import { projects } from "@/data/projects";
import { skillCategories, skills } from "@/data/skills";
import { readingTimeMinutes, sortPostsByDate } from "@/lib/blog";
import {
  groupedSkillPreviews,
  hasProfileContent,
  isEmptyList,
} from "@/lib/content";
import { formatExperiencePeriod, formatIsoDate } from "@/lib/dates";
import { featuredProjects } from "@/lib/projects";

export async function HomePage() {
  const t = await getTranslations("home");
  const tExperience = await getTranslations("experience");
  const tProjects = await getTranslations("projects");
  const tBlog = await getTranslations("blog");
  const locale = await getLocale();
  const showProfile = hasProfileContent(profile);
  const skillPreviews = groupedSkillPreviews(skillCategories, skills);
  const highlightedProjects = featuredProjects(projects, projectViewCounts);

  return (
    <div className="stack-section">
      <header className="stack-compact border-b border-border pb-5">
        <p className="type-label text-primary">{t("hero.kicker")}</p>
        <h1 className="type-display">
          {profile.displayName ?? t("hero.placeholderName")}
        </h1>
        <p className="max-w-prose type-body text-muted-foreground">
          {profile.headline ?? t("hero.placeholderHeadline")}
        </p>
        {!showProfile ? (
          <p className="max-w-prose type-small text-muted-foreground">
            {t("hero.placeholderSummary")}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2 pt-1">
          <ButtonLink href="/projects" size="sm">
            {t("hero.viewWork")}
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline" size="sm">
            {t("hero.contact")}
          </ButtonLink>
        </div>
      </header>

      <PageSection
        id="identity"
        title={t("about.title")}
        action={
          <ButtonLink href="/about" variant="ghost" size="sm">
            {t("about.more")}
          </ButtonLink>
        }
      >
        {showProfile && profile.summary ? (
          <p className="max-w-prose type-body text-muted-foreground">
            {profile.summary}
          </p>
        ) : (
          <ContentPlaceholder>{t("about.placeholder")}</ContentPlaceholder>
        )}
      </PageSection>

      <PageSection
        id="focus"
        title={t("skills.title")}
        action={
          <ButtonLink href="/skills" variant="ghost" size="sm">
            {t("skills.more")}
          </ButtonLink>
        }
      >
        {isEmptyList(skills) ? (
          <ContentPlaceholder>{t("skills.placeholder")}</ContentPlaceholder>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {skillPreviews.map((group) => (
              <PreviewCard
                key={group.id}
                title={group.label}
                description={
                  group.items.length > 0 ? group.items.join(" · ") : undefined
                }
              />
            ))}
          </div>
        )}
      </PageSection>

      <PageSection
        id="experience"
        title={t("experience.title")}
        action={
          <ButtonLink href="/experience" variant="ghost" size="sm">
            {t("experience.more")}
          </ButtonLink>
        }
      >
        {isEmptyList(experience) ? (
          <ContentPlaceholder>{t("experience.placeholder")}</ContentPlaceholder>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {experience.map((item) => (
              <PreviewCard
                key={item.id}
                eyebrow={formatExperiencePeriod(
                  item.startDate,
                  item.endDate,
                  locale,
                  tExperience("present"),
                )}
                title={item.role}
                description={[item.company, item.description]
                  .filter(Boolean)
                  .join(" — ")}
              />
            ))}
          </div>
        )}
      </PageSection>

      <PageSection
        id="projects"
        title={t("projects.title")}
        action={
          <ButtonLink href="/projects" variant="ghost" size="sm">
            {t("projects.more")}
          </ButtonLink>
        }
      >
        {isEmptyList(projects) ? (
          <ContentPlaceholder>{t("projects.placeholder")}</ContentPlaceholder>
        ) : (
          <ProjectGrid
            projects={highlightedProjects}
            tagsLabel={tProjects("technologies")}
            empty={
              <ContentPlaceholder>
                {t("projects.placeholder")}
              </ContentPlaceholder>
            }
          />
        )}
      </PageSection>

      <PageSection
        id="writing"
        title={t("writing.title")}
        action={
          <ButtonLink href="/blog" variant="ghost" size="sm">
            {t("writing.more")}
          </ButtonLink>
        }
      >
        {isEmptyList(posts) ? (
          <ContentPlaceholder>{t("writing.placeholder")}</ContentPlaceholder>
        ) : (
          <ArticleGrid
            posts={sortPostsByDate(posts).slice(0, 3)}
            dateLabel={(post) =>
              tBlog("published", {
                date: formatIsoDate(post.publishedAt, locale),
              })
            }
            readingLabel={(post) =>
              tBlog("readingTime", {
                minutes: readingTimeMinutes(post.content),
              })
            }
            tagsLabel={tBlog("tags")}
            empty={
              <ContentPlaceholder>
                {t("writing.placeholder")}
              </ContentPlaceholder>
            }
          />
        )}
      </PageSection>

      <CtaBanner
        id="contact"
        title={t("contact.title")}
        body={t("contact.body")}
        action={
          <ButtonLink href="/contact" size="sm">
            {t("contact.action")}
          </ButtonLink>
        }
      />
    </div>
  );
}
