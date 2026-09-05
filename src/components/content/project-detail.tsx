import { ProjectViewTracker } from "@/analytics/project-view-tracker";
import { PageSection } from "@/components/content/page-section";
import { ProjectLinks } from "@/components/content/project-links";
import { ProjectMediaGallery } from "@/components/content/project-media";
import { ProjectTags } from "@/components/content/project-tags";
import { RelatedItemList } from "@/components/content/related-item-list";
import type { ProjectItem } from "@/data/projects";
import type { Skill } from "@/data/skills";
import { projectCaseStudyEntries } from "@/lib/projects";

export type ProjectDetailCopy = {
  technologies: string;
  skills: string;
  media: string;
  sourceCode: string;
  liveDemo: string;
  noSkills: string;
  sections: Record<
    | "description"
    | "architecture"
    | "problem"
    | "solution"
    | "challenges"
    | "decisions"
    | "tradeoffs"
    | "testing"
    | "performance"
    | "futureImprovements",
    string
  >;
};

type ProjectDetailProps = {
  project: ProjectItem;
  skills: readonly Skill[];
  copy: ProjectDetailCopy;
};

export function ProjectDetail({ project, skills, copy }: ProjectDetailProps) {
  const namedSections = projectCaseStudyEntries(project).map((entry) => ({
    id: entry.id,
    title:
      entry.id in copy.sections
        ? copy.sections[entry.id as keyof ProjectDetailCopy["sections"]]
        : entry.id,
    body: entry.body,
  }));

  const extraSections = project.sections.filter((section) => section.body);
  const relatedSkills = skills.filter((skill) =>
    project.skillIds.includes(skill.id),
  );

  return (
    <article className="stack-section">
      <ProjectViewTracker slug={project.slug} />
      <header className="stack-compact border-b border-border pb-8">
        <h1 className="type-display">{project.title}</h1>
        <p className="max-w-prose type-body text-muted-foreground">
          {project.summary}
        </p>
        <ProjectTags tags={project.technologies} label={copy.technologies} />
        <ProjectLinks
          githubUrl={project.githubUrl}
          demoUrl={project.demoUrl}
          sourceLabel={copy.sourceCode}
          demoLabel={copy.liveDemo}
        />
      </header>

      <ProjectMediaGallery items={project.media} label={copy.media} />

      {project.skillIds.length > 0 ? (
        <PageSection id="skills" title={copy.skills}>
          <RelatedItemList
            items={relatedSkills.map((skill) => ({
              id: skill.id,
              label: skill.name,
              href: "/skills",
              fragment: skill.id,
            }))}
            emptyLabel={copy.noSkills}
          />
        </PageSection>
      ) : null}

      {namedSections.map((section) => (
        <PageSection key={section.id} id={section.id} title={section.title}>
          <p className="max-w-prose type-body text-muted-foreground">
            {section.body}
          </p>
        </PageSection>
      ))}

      {extraSections.map((section) => (
        <PageSection key={section.id} id={section.id} title={section.title}>
          <p className="max-w-prose type-body text-muted-foreground">
            {section.body}
          </p>
        </PageSection>
      ))}
    </article>
  );
}
