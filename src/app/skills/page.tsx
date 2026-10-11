import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/site/page-header";
import { profile } from "@/data/profile";
import { skillCategories, skills } from "@/data/skills";

export const metadata: Metadata = {
  title: "Skills",
  description: "Languages, frameworks and tools.",
};

export default function SkillsPage() {
  const focus = new Set([
    ...profile.focusSkillIds,
    ...profile.expertiseSkillIds,
  ]);

  return (
    <div className="app-container flex flex-col gap-12">
      <PageHeader
        title="Skills"
        description="Highlighted skills are where I work most day to day."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {skillCategories.map((category, index) => {
          const items = skills.filter(
            (skill) => skill.categoryId === category.id,
          );
          if (items.length === 0) return null;

          return (
            <Card
              key={category.id}
              className="lift fade-up"
              style={{ "--delay": `${index * 60}ms` } as React.CSSProperties}
            >
              <CardHeader>
                <CardTitle className="text-sm">{category.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant={focus.has(skill.id) ? "default" : "secondary"}
                      className="font-normal"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
