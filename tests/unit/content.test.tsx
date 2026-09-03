import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { ContentPlaceholder } from "@/components/content/content-placeholder";
import { PreviewCard } from "@/components/content/preview-card";
import { badges } from "@/data/badges";
import { posts } from "@/data/blog";
import { certifications } from "@/data/certifications";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { resumes } from "@/data/resumes";
import { skills } from "@/data/skills";
import {
  experienceForSkill,
  getSkillCategoryEvidence,
  getSkillEvidence,
  hasAboutContent,
  hasProfileContent,
  isEmptyList,
  projectsForExperience,
} from "@/lib/content";

const publishedProfile = {
  displayName: "Ada",
  headline: null,
  summary: null,
  background: null,
  philosophy: null,
  focusSkillIds: [],
  expertiseSkillIds: [],
  interests: [],
};

describe("content helpers", () => {
  it("treats the sample profile as published content", () => {
    expect(hasProfileContent(profile)).toBe(true);
    expect(hasAboutContent(profile)).toBe(true);
    expect(hasProfileContent(publishedProfile)).toBe(true);
    expect(
      hasAboutContent({
        ...publishedProfile,
        philosophy: "Prefer small interfaces.",
      }),
    ).toBe(true);
  });

  it("treats empty collections as unpublished and sample catalogs as populated", () => {
    expect(isEmptyList([])).toBe(true);
    expect(isEmptyList(projects)).toBe(false);
    expect(isEmptyList(experience)).toBe(false);
    expect(isEmptyList(skills)).toBe(false);
    expect(isEmptyList(posts)).toBe(false);
    expect(isEmptyList(resumes)).toBe(false);
    expect(isEmptyList(certifications)).toBe(false);
    expect(isEmptyList(badges)).toBe(false);
    expect(isEmptyList([{ id: "1" }])).toBe(false);
  });
});

describe("content relationships", () => {
  const collections = {
    skillCategories: [{ id: "lang", label: "Languages" }],
    skills: [{ id: "ts", name: "TypeScript", categoryId: "lang" }],
    experience: [
      {
        id: "role-1",
        company: "Example Co",
        role: "Engineer",
        startDate: "2021-01",
        endDate: "2023-01",
        description: null,
        skillIds: ["ts"],
        projectIds: ["proj-1"],
        technologies: ["TypeScript"],
        achievements: [],
      },
    ],
    projects: [
      {
        id: "proj-1",
        slug: "internal-tool",
        title: "Internal tool",
        summary: "A tool",
        description: null,
        technologies: [],
        skillIds: ["ts"],
        githubUrl: null,
        demoUrl: null,
        media: [],
        architecture: null,
        problem: null,
        solution: null,
        challenges: null,
        decisions: null,
        tradeoffs: null,
        testing: null,
        performance: null,
        futureImprovements: null,
        sections: [],
        experienceIds: ["role-1"],
      },
    ],
  };

  it("counts linked roles and projects as skill evidence", () => {
    expect(getSkillEvidence("ts", collections)).toEqual({
      skillId: "ts",
      categoryId: "lang",
      projectCount: 1,
      experienceCount: 1,
    });
    expect(experienceForSkill("ts", collections.experience)).toHaveLength(1);
    expect(
      projectsForExperience(
        "role-1",
        collections.experience,
        collections.projects,
      ),
    ).toHaveLength(1);
  });

  it("aggregates category evidence for later analytics", () => {
    expect(getSkillCategoryEvidence(collections)).toEqual([
      {
        categoryId: "lang",
        label: "Languages",
        skillCount: 1,
        projectCount: 1,
        experienceCount: 1,
      },
    ]);
  });
});

describe("ContentPlaceholder", () => {
  it("renders structured placeholder copy", () => {
    render(
      <ContentPlaceholder>
        Selected projects will be listed here.
      </ContentPlaceholder>,
    );
    expect(
      screen.getByText("Selected projects will be listed here."),
    ).toBeInTheDocument();
  });
});

describe("PreviewCard", () => {
  it("renders title and optional eyebrow without requiring a link", () => {
    render(
      <PreviewCard
        eyebrow="2020 — 2023"
        title="Role title"
        description="Summary"
      />,
    );

    expect(screen.getByText("Role title")).toBeInTheDocument();
    expect(screen.getByText("2020 — 2023")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
