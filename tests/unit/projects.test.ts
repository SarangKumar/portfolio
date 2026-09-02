import { describe, expect, it } from "@jest/globals";
import type { ProjectItem } from "@/data/projects";
import {
  featuredProjects,
  getProjectBySlug,
  isProjectSlug,
  projectCaseStudyEntries,
  projectHref,
} from "@/lib/projects";

function project(
  overrides: Pick<ProjectItem, "id" | "slug" | "title"> & Partial<ProjectItem>,
): ProjectItem {
  return {
    summary: "Summary",
    description: null,
    technologies: [],
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
    ...overrides,
  };
}

describe("project slugs", () => {
  it("accepts public slugs and rejects identifiers", () => {
    expect(isProjectSlug("internal-tool")).toBe(true);
    expect(isProjectSlug("proj-1")).toBe(true);
    expect(isProjectSlug("ABC")).toBe(false);
    expect(isProjectSlug("has_underscore")).toBe(false);
    expect(projectHref("internal-tool")).toBe("/projects/internal-tool");
  });

  it("looks up projects by slug instead of internal id", () => {
    const items = [
      project({ id: "abc123", slug: "internal-tool", title: "Internal tool" }),
    ];

    expect(getProjectBySlug("internal-tool", items)?.id).toBe("abc123");
    expect(getProjectBySlug("abc123", items)).toBeUndefined();
  });
});

describe("featuredProjects", () => {
  const items = [
    project({ id: "1", slug: "alpha", title: "Alpha" }),
    project({ id: "2", slug: "beta", title: "Beta" }),
    project({ id: "3", slug: "gamma", title: "Gamma" }),
    project({ id: "4", slug: "delta", title: "Delta" }),
  ];

  it("falls back to catalog order when popularity is unpublished", () => {
    expect(featuredProjects(items, {}, 3).map((item) => item.slug)).toEqual([
      "alpha",
      "beta",
      "gamma",
    ]);
  });

  it("ranks by project_view counts when they exist", () => {
    expect(
      featuredProjects(items, { delta: 9, beta: 4, alpha: 1 }, 3).map(
        (item) => item.slug,
      ),
    ).toEqual(["delta", "beta", "alpha"]);
  });

  it("fills remaining featured slots from catalog order", () => {
    expect(
      featuredProjects(items, { delta: 9 }, 3).map((item) => item.slug),
    ).toEqual(["delta", "alpha", "beta"]);
  });

  it("does not hardcode the featured limit", () => {
    expect(
      featuredProjects(items, { gamma: 2 }, 2).map((item) => item.slug),
    ).toEqual(["gamma", "alpha"]);
  });
});

describe("projectCaseStudyEntries", () => {
  it("omits unpublished case-study fields", () => {
    const item = project({
      id: "1",
      slug: "tool",
      title: "Tool",
      problem: "Need a tool.",
      sections: [{ id: "ops", title: "Operations", body: "Runbooks." }],
    });

    expect(projectCaseStudyEntries(item)).toEqual([
      { id: "problem", body: "Need a tool." },
    ]);
  });
});
