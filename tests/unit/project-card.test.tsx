import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/content/project-card";
import { ProjectGrid } from "@/components/content/project-grid";
import { ProjectTags } from "@/components/content/project-tags";
import type { ProjectItem } from "@/data/projects";

const sample: ProjectItem = {
  id: "hidden-id",
  slug: "sample-app",
  title: "Sample app",
  summary: "A compact case study.",
  description: null,
  technologies: ["TypeScript"],
  skillIds: [],
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
  experienceIds: [],
};

describe("ProjectTags", () => {
  it("renders technology names without scores", () => {
    render(
      <ProjectTags tags={["TypeScript", "Next.js"]} label="Technologies" />,
    );

    expect(screen.getByLabelText("Technologies")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.queryByText("%")).not.toBeInTheDocument();
  });
});

describe("ProjectCard", () => {
  it("links with the public slug rather than the internal id", () => {
    render(<ProjectCard project={sample} tagsLabel="Technologies" />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/projects/sample-app",
    );
    expect(screen.queryByText("hidden-id")).not.toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });
});

describe("ProjectGrid", () => {
  it("renders the empty state when no projects are published", () => {
    render(
      <ProjectGrid
        projects={[]}
        tagsLabel="Technologies"
        empty={<p>Projects will be listed here when they are published.</p>}
      />,
    );

    expect(
      screen.getByText("Projects will be listed here when they are published."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
