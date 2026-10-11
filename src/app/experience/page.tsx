import type { Metadata } from "next";
import { Marker } from "@/components/ui/marker";
import { PageHeader } from "@/components/site/page-header";
import { Timeline, type TimelineEntry } from "@/components/site/timeline";
import { experience } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
  description: "Work history and education, with what I achieved at each.",
};

function formatRange(start: string, end: string | null) {
  return `${start} — ${end ?? "Present"}`;
}

function toEntry(role: (typeof experience)[number]): TimelineEntry {
  return {
    id: role.id,
    kind: role.kind,
    title: role.role,
    subtitle: role.company,
    meta: formatRange(role.startDate, role.endDate),
    description: role.description,
    achievements: role.achievements,
    tags: role.technologies,
  };
}

export default function ExperiencePage() {
  const work = experience.filter((role) => role.kind === "work").map(toEntry);
  const education = experience
    .filter((role) => role.kind === "education")
    .map(toEntry);

  return (
    <div className="app-container flex flex-col gap-16">
      <PageHeader
        title="Experience"
        description="Roles and education, with the work and achievements behind each."
      />

      {work.length > 0 ? (
        <section className="flex flex-col gap-6">
          <Marker variant="separator">Work</Marker>
          <Timeline entries={work} />
        </section>
      ) : null}

      {education.length > 0 ? (
        <section className="flex flex-col gap-6">
          <Marker variant="separator">Education</Marker>
          <Timeline entries={education} delayOffset={work.length * 140} />
        </section>
      ) : null}
    </div>
  );
}
