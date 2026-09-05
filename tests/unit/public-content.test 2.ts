import { describe, expect, it } from "@jest/globals";
import { createPublicContentAccess } from "@/content/access";
import { withCatalogFallback } from "@/content/fallback";
import type {
  PersistedBlogPost,
  PersistedExperience,
  PersistedProject,
  PersistedSkill,
  PersistedSkillCategory,
} from "@/content/records";
import type { PublicContentSource } from "@/content/source";
import { publicSitemapEntries } from "@/lib/seo";
import { getSkillEvidence } from "@/lib/content";

const secret = "internal-admin-note-do-not-leak";

function project(
  overrides: Partial<PersistedProject> &
    Pick<PersistedProject, "key" | "slug" | "title" | "status">,
): PersistedProject {
  return {
    summary: "Summary",
    description: null,
    technologies: ["TypeScript"],
    skillKeys: ["skill-ts"],
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
    experienceKeys: [],
    internalNotes: secret,
    ...overrides,
  };
}

function post(
  overrides: Partial<PersistedBlogPost> &
    Pick<PersistedBlogPost, "slug" | "title" | "status">,
): PersistedBlogPost {
  return {
    summary: "A note.",
    content: "## Hello",
    publishedAt: "2026-01-01",
    updatedAt: null,
    tags: ["layout"],
    categories: ["notes"],
    coverImage: null,
    internalNotes: secret,
    ...overrides,
  };
}

function experience(
  overrides: Partial<PersistedExperience> &
    Pick<PersistedExperience, "key" | "company" | "status">,
): PersistedExperience {
  return {
    role: "Engineer",
    startDate: "2021-01",
    endDate: "2022-01",
    description: null,
    technologies: ["TypeScript"],
    skillKeys: ["skill-ts"],
    projectKeys: ["proj-public"],
    achievements: [],
    sortOrder: 0,
    internalNotes: secret,
    ...overrides,
  };
}

function sourceWith(
  overrides: Partial<PublicContentSource>,
): PublicContentSource {
  const empty = async () => [];

  return {
    listProjects: empty,
    listExperience: empty,
    listSkillCategories: empty,
    listSkills: empty,
    listPosts: empty,
    listResumes: empty,
    listCertifications: empty,
    listBadges: empty,
    ...overrides,
  };
}

describe("public content access", () => {
  const projects = [
    project({
      key: "proj-public",
      slug: "public-app",
      title: "Public app",
      status: "published",
      skillKeys: ["skill-ts"],
      experienceKeys: ["exp-public"],
    }),
    project({
      key: "proj-draft",
      slug: "secret-app",
      title: "Secret app",
      status: "draft",
    }),
    project({
      key: "proj-archived",
      slug: "old-app",
      title: "Old app",
      status: "archived",
    }),
  ];

  const posts = [
    post({
      slug: "public-note",
      title: "Public note",
      status: "published",
      publishedAt: "2026-06-01",
    }),
    post({
      slug: "draft-note",
      title: "Draft note",
      status: "draft",
      publishedAt: "2026-07-01",
    }),
  ];

  const access = createPublicContentAccess(
    sourceWith({
      listProjects: async () => projects,
      listExperience: async () => [
        experience({
          key: "exp-public",
          company: "Public Co",
          status: "published",
        }),
        experience({
          key: "exp-private",
          company: "Hidden Co",
          status: "draft",
        }),
      ],
      listSkillCategories: async () =>
        [
          {
            key: "languages",
            label: "Languages",
            sortOrder: 0,
            status: "published",
          },
          {
            key: "internal",
            label: "Internal",
            sortOrder: 1,
            status: "draft",
          },
        ] satisfies PersistedSkillCategory[],
      listSkills: async () =>
        [
          {
            key: "skill-ts",
            name: "TypeScript",
            categoryKey: "languages",
            status: "published",
          },
          {
            key: "skill-hidden",
            name: "Hidden",
            categoryKey: "languages",
            status: "draft",
          },
          {
            key: "skill-internal-cat",
            name: "Vault",
            categoryKey: "internal",
            status: "published",
          },
        ] satisfies PersistedSkill[],
      listPosts: async () => posts,
    }),
  );

  it("returns only published projects and looks them up by public slug", async () => {
    const published = await access.getPublishedProjects();

    expect(published.map((item) => item.slug)).toEqual(["public-app"]);
    expect(await access.getPublishedProjectBySlug("public-app")).toMatchObject({
      id: "proj-public",
      title: "Public app",
    });
    expect(await access.getPublishedProjectBySlug("secret-app")).toBeNull();
    expect(await access.getPublishedProjectBySlug("missing-app")).toBeNull();
    expect(await access.getPublishedProjectBySlug("proj-public")).toBeNull();
  });

  it("never exposes internal notes or unpublished titles on public records", async () => {
    const published = await access.getPublishedProjects();
    const serialized = JSON.stringify(published);

    expect(serialized).not.toContain(secret);
    expect(serialized).not.toContain("Secret app");
    expect(serialized).not.toContain("internalNotes");
  });

  it("filters unpublished blog posts and sorts published ones by date", async () => {
    const published = await access.getPublishedBlogPosts();

    expect(published.map((item) => item.slug)).toEqual(["public-note"]);
    expect(await access.getPublishedBlogPostBySlug("draft-note")).toBeNull();
    expect(JSON.stringify(published)).not.toContain(secret);
  });

  it("keeps skill-category relationships without unpublished skills", async () => {
    const catalog = await access.getPublishedSkills();

    expect(catalog.categories.map((item) => item.id)).toEqual(["languages"]);
    expect(catalog.skills).toEqual([
      { id: "skill-ts", name: "TypeScript", categoryId: "languages" },
    ]);

    const evidence = getSkillEvidence("skill-ts", {
      skills: catalog.skills,
      experience: await access.getPublishedExperience(),
      projects: await access.getPublishedProjects(),
    });

    expect(evidence).toEqual({
      skillId: "skill-ts",
      categoryId: "languages",
      projectCount: 1,
      experienceCount: 1,
    });
  });

  it("omits unpublished experience from the public timeline", async () => {
    const roles = await access.getPublishedExperience();

    expect(roles.map((item) => item.id)).toEqual(["exp-public"]);
    expect(roles[0]?.technologies).toEqual(["TypeScript"]);
    expect(JSON.stringify(roles)).not.toContain("Hidden Co");
  });
});

describe("catalog fallback", () => {
  it("uses catalog records when the primary source is empty or fails", async () => {
    const catalog = sourceWith({
      listProjects: async () => [
        project({
          key: "proj-catalog",
          slug: "catalog-app",
          title: "Catalog app",
          status: "published",
          internalNotes: null,
        }),
      ],
    });

    const emptyPrimary = createPublicContentAccess(
      withCatalogFallback(
        sourceWith({
          listProjects: async () => [],
        }),
        catalog,
      ),
    );
    const failingPrimary = createPublicContentAccess(
      withCatalogFallback(
        sourceWith({
          listProjects: async () => {
            throw new Error("ECONNREFUSED");
          },
        }),
        catalog,
      ),
    );

    expect((await emptyPrimary.getPublishedProjects())[0]?.slug).toBe(
      "catalog-app",
    );
    expect((await failingPrimary.getPublishedProjects())[0]?.slug).toBe(
      "catalog-app",
    );
  });
});

describe("sitemap published filtering", () => {
  it("does not list unpublished project or article slugs", () => {
    const urls = publicSitemapEntries(
      [
        {
          id: "proj-public",
          slug: "public-app",
          title: "Public app",
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
        },
      ],
      [
        {
          slug: "public-note",
          title: "Public note",
          description: "A note.",
          content: "Hello",
          publishedAt: "2026-01-01",
          updatedAt: null,
          tags: [],
          categories: [],
          coverImage: null,
        },
      ],
    ).map((entry) => entry.url);

    expect(urls).toContain("http://localhost:3000/projects/public-app");
    expect(urls).toContain("http://localhost:3000/blog/public-note");
    expect(urls).not.toContain("http://localhost:3000/projects/secret-app");
    expect(urls).not.toContain("http://localhost:3000/blog/draft-note");
  });
});
