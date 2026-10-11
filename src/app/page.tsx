import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/site/project-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const focusSkills = profile.focusSkillIds
    .map((id) => skills.find((skill) => skill.id === id))
    .filter((skill) => skill !== undefined);
  const featured = projects.slice(0, 3);
  const latest = experience[0];

  return (
    <div className="flex flex-col gap-20">
      <section className="mesh-bg relative -mt-12 pt-12 sm:-mt-16 sm:pt-16">
        <div className="app-container flex flex-col gap-6">
          <p className="chip fade-up w-fit">
            <span className="chip-dot" aria-hidden />
            {profile.headline}
          </p>
          <h1
            className="fade-up text-4xl font-semibold tracking-tight sm:text-6xl"
            style={{ "--delay": "60ms" } as React.CSSProperties}
          >
            {profile.displayName}
          </h1>
          <p
            className="text-muted-foreground fade-up max-w-2xl text-lg leading-relaxed"
            style={{ "--delay": "120ms" } as React.CSSProperties}
          >
            {profile.summary}
          </p>
          <div
            className="fade-up flex flex-wrap gap-3"
            style={{ "--delay": "180ms" } as React.CSSProperties}
          >
            <Link href="/projects" className={buttonVariants({ size: "lg" })}>
              View projects
              <ArrowRight />
            </Link>
            <Link
              href="/contact"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Get in touch
            </Link>
          </div>
          <div
            className="fade-up flex flex-wrap gap-2 pt-2"
            style={{ "--delay": "240ms" } as React.CSSProperties}
          >
            {focusSkills.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="font-normal">
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="app-container flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="section-title">Featured projects</h2>
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            All projects →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </section>

      {latest ? (
        <section className="app-container flex flex-col gap-6">
          <h2 className="section-title">Currently</h2>
          <Card className={cn("lift fade-up")}>
            <CardHeader>
              <CardTitle className="text-base">
                {latest.role} · {latest.company}
              </CardTitle>
              <CardDescription>{latest.description}</CardDescription>
            </CardHeader>
            <div className="flex flex-col gap-4 px-6 pb-2">
              <Link
                href="/experience"
                className="text-primary inline-flex w-fit items-center gap-1 text-sm"
              >
                Full experience <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
