import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Timeline, type TimelineEntry } from "@/components/site/timeline";
import { experience } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
  description: "Education and work, in order, with what I achieved at each.",
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
  // One chronological line, oldest first — education and work interleaved
  // the way they actually happened, not split into disconnected lists.
  const timeline = [...experience]
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map(toEntry);

  return (
    <div className="app-container flex flex-col gap-12">
      <PageHeader
        title="Experience"
        description="Education and work, in the order it happened."
      />

      <Timeline entries={timeline} />
    </div>
  );
}
