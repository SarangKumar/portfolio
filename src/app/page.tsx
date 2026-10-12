import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import {
  GithubContributions,
  GithubContributionsSkeleton,
} from "@/components/site/github-contributions";
import { ProjectCard } from "@/components/site/project-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyLead } from "@/components/ui/typography";
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

  const work = experience.filter((role) => role.kind === "work");
  const currentRole = work.find((role) => role.endDate === null);
  const mostRecentRole = [...work].sort((a, b) =>
    b.startDate.localeCompare(a.startDate),
  )[0];
  const highlightRole = currentRole ?? mostRecentRole;

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
          <TypographyLead
            className="text-muted-foreground fade-up max-w-2xl text-lg"
            style={{ "--delay": "120ms" } as React.CSSProperties}
          >
            {profile.summary}
          </TypographyLead>
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
        {/* Bento: the first project leads, spanning both rows; the other
            two stack alongside it. With exactly three featured projects this
            reads as one clear lead story plus two supporting ones. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-rows-2">
          {featured[0] ? (
            <div className="lg:row-span-2">
              <ProjectCard project={featured[0]} index={0} featured />
            </div>
          ) : null}
          {featured.slice(1).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index + 1} />
          ))}
        </div>
      </section>

      <section className="app-container flex flex-col gap-6">
        <Suspense fallback={<GithubContributionsSkeleton />}>
          <GithubContributions />
        </Suspense>
      </section>

      {highlightRole ? (
        <section className="app-container flex flex-col gap-6">
          <h2 className="section-title">
            {currentRole ? "Currently" : "Most recently"}
          </h2>
          <Card className={cn("lift fade-up")}>
            <CardHeader>
              <CardTitle className="text-base">
                {highlightRole.role} · {highlightRole.company}
              </CardTitle>
              <CardDescription>{highlightRole.description}</CardDescription>
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
