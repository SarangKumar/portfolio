import { ProjectCard } from "@/components/site/project-card";
import { PageIntro, Section } from "@/components/site/section";
import { getContent, getT } from "@/lib/content";
import { SkillsGrid } from "@/components/site/skills-grid";
import { pageMetadata } from "@/lib/page-meta";

export const revalidate = 60;
export const generateMetadata = () => pageMetadata("projects");

export default async function ProjectsPage() {
  const content = await getContent();
  const t = await getT();
  const page = content.site.pages.projects;
  const shipped = content.projects.filter((p) => p.kind !== "idea");
  const ideas = content.projects.filter((p) => p.kind === "idea");

  return (
    <>
      <PageIntro index="01" eyebrow={page.eyebrow} title={page.title}>
        {page.intro}
      </PageIntro>
      <section className="container-x">
        <div className="border-border border-t">
          {shipped.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>
      {ideas.length ? (
        <Section index="02" title={t("projects.future")}>
          <div className="border-border border-t">
            {ideas.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={shipped.length + i} />
            ))}
          </div>
        </Section>
      ) : null}
      <Section index={ideas.length ? "03" : "02"} title={t("projects.skills")}>
        <SkillsGrid content={content} />
      </Section>
    </>
  );
}
