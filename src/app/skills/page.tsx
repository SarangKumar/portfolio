import type { Metadata } from "next";
import type { ComponentType } from "react";
import {
  Code2,
  Database,
  Layout,
  Server,
  TestTube2,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Marker } from "@/components/ui/marker";
import { PageHeader } from "@/components/site/page-header";
import { profile } from "@/data/profile";
import { skillCategories, skills } from "@/data/skills";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Skills",
  description: "Languages, frameworks and tools, grouped by area.",
};

const categoryIcon: Record<string, ComponentType<{ className?: string }>> = {
  languages: Code2,
  databases: Database,
  engineering: Wrench,
  testing: TestTube2,
  backend: Server,
  frontend: Layout,
};

export default function SkillsPage() {
  const focusIds = new Set(profile.focusSkillIds);
  const expertiseIds = new Set(profile.expertiseSkillIds);
  const focusSkills = profile.focusSkillIds
    .map((id) => skills.find((skill) => skill.id === id))
    .filter((skill) => skill !== undefined);

  return (
    <div className="app-container flex flex-col gap-14">
      <PageHeader
        title="Skills"
        description="Grouped by area. The row below is where I spend most of my time right now."
      />

      {focusSkills.length > 0 ? (
        <section
          className="fade-up flex flex-col gap-3"
          style={{ "--delay": "180ms" } as React.CSSProperties}
        >
          <span className="meta uppercase tracking-wide">
            Currently focused on
          </span>
          <div className="flex flex-wrap gap-2">
            {focusSkills.map((skill) => (
              <Badge key={skill.id} className="shadow-[0_0_14px_var(--glow)]">
                {skill.name}
              </Badge>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {skillCategories.map((category, index) => {
          const items = skills.filter(
            (skill) => skill.categoryId === category.id,
          );
          if (items.length === 0) return null;
          const Icon = categoryIcon[category.id] ?? Code2;

          return (
            <section
              key={category.id}
              className="fade-up flex flex-col gap-3"
              style={
                { "--delay": `${240 + index * 70}ms` } as React.CSSProperties
              }
            >
              <Marker variant="border" className="gap-2">
                <Icon className="text-primary size-4" />
                <span className="text-foreground font-medium">
                  {category.label}
                </span>
              </Marker>
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill) => {
                  const emphasized =
                    focusIds.has(skill.id) || expertiseIds.has(skill.id);
                  return (
                    <Badge
                      key={skill.id}
                      variant={emphasized ? "secondary" : "outline"}
                      className={cn(
                        "font-normal",
                        emphasized && "border-primary/30",
                      )}
                    >
                      {skill.name}
                    </Badge>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
