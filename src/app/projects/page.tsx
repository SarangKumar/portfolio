import type { Metadata } from "next";
import { ProjectCard } from "@/components/site/project-card";
import { PageIntro, Section } from "@/components/site/section";
import { getContent, REVALIDATE } from "@/lib/content";
import { deriveSkills } from "@/lib/derive";

export const revalidate = REVALIDATE;
export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const content = await getContent();
  const shipped = content.projects.filter((p) => p.kind !== "idea");
  const ideas = content.projects.filter((p) => p.kind === "idea");
  const skills = deriveSkills(content);
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <>
      <PageIntro index="01" eyebrow="Selected work" title="Projects">
        Hover or focus a project for a quick look; open it for the full case
        study — architecture, implementation, testing and trade-offs.
      </PageIntro>
      <section className="container-x">
        <div className="border-border border-t">
          {shipped.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>
      {ideas.length ? (
        <Section index="02" title="Future projects">
          <div className="border-border border-t">
            {ideas.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={shipped.length + i} />
            ))}
          </div>
        </Section>
      ) : null}
      <Section index="03" title="Skills — derived from the work above">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c}>
              <h3 className="font-serif text-2xl">{c}</h3>
              <ul className="mt-4 space-y-2">
                {skills
                  .filter((s) => s.category === c)
                  .map((s) => (
                    <li
                      key={s.name}
                      className="flex items-baseline justify-between gap-4 text-sm"
                    >
                      <span>{s.name}</span>
                      <span className="tag truncate">
                        {s.projects.length ? s.projects.join(", ") : "—"}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
