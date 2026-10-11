import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/site/page-header";
import { experience } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
  description: "Roles and the work behind them.",
};

function formatRange(start: string, end: string | null) {
  return `${start} — ${end ?? "Present"}`;
}

export default function ExperiencePage() {
  return (
    <div className="app-container flex flex-col gap-12">
      <PageHeader
        title="Experience"
        description="Roles, the work behind them, and the tools I used."
      />

      <ol className="flex flex-col gap-4">
        {experience.map((role, index) => (
          <li key={role.id}>
            <Card
              className="lift fade-up"
              style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}
            >
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-base">
                    {role.role} · {role.company}
                  </CardTitle>
                  <span className="meta">
                    {formatRange(role.startDate, role.endDate)}
                  </span>
                </div>
                {role.description ? (
                  <CardDescription>{role.description}</CardDescription>
                ) : null}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {role.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="font-normal">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
