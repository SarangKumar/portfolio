import { describe, expect, it } from "@jest/globals";
import type { ProjectItem } from "@/data/projects";
import { projectMetadata } from "@/lib/project-metadata";

const project: ProjectItem = {
  id: "hidden-id",
  slug: "sample-app",
  title: "Sample app",
  summary: "A compact case study.",
  description: "Longer notes.",
  technologies: [],
  skillIds: [],
  githubUrl: "https://github.com/example/sample-app",
  demoUrl: null,
  media: [
    {
      src: "/projects/sample-app.png",
      alt: "Sample app screenshot",
    },
  ],
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

describe("projectMetadata", () => {
  it("uses the slug in canonical and Open Graph URLs", () => {
    const metadata = projectMetadata(project);

    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/projects/sample-app",
    );
    expect(metadata.openGraph?.url).toBe(
      "http://localhost:3000/projects/sample-app",
    );
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "http://localhost:3000/projects/sample-app.png",
        alt: "Sample app screenshot",
      },
    ]);
    expect(JSON.stringify(metadata)).not.toContain("hidden-id");
  });
});
