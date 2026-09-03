import { describe, expect, it } from "@jest/globals";
import { authorizeAdminMutation } from "@/cms/authorize";
import { createProjectService } from "@/cms/projects/service";
import type { ProjectStore } from "@/cms/projects/store";
import type { AdminProjectRecord } from "@/cms/projects/types";
import {
  parseStringList,
  validateProjectWriteInput,
} from "@/cms/projects/validation";
import { publishedProjects } from "@/content/published";
import { createAdminRecord } from "@/admin/directory";

const admin = createAdminRecord("owner@example.com", "active");

function record(
  overrides: Partial<AdminProjectRecord> &
    Pick<AdminProjectRecord, "key" | "slug" | "title" | "status">,
): AdminProjectRecord {
  return {
    summary: "A public summary.",
    description: null,
    technologies: ["TypeScript"],
    skillKeys: ["skill-lorem"],
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
    internalNotes: "admin-only",
    publishedAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function memoryStore(seed: AdminProjectRecord[] = []): ProjectStore {
  const records = new Map(seed.map((item) => [item.key, { ...item }]));

  return {
    async list() {
      return [...records.values()].map((item) => ({
        key: item.key,
        slug: item.slug,
        title: item.title,
        status: item.status,
        updatedAt: item.updatedAt,
      }));
    },
    async getByKey(key) {
      return records.get(key) ?? null;
    },
    async getBySlug(slug) {
      return [...records.values()].find((item) => item.slug === slug) ?? null;
    },
    async create(next) {
      records.set(next.key, { ...next });
      return { ...next };
    },
    async update(key, patch) {
      const current = records.get(key);

      if (!current) {
        throw new Error("missing");
      }

      const next = { ...current, ...patch };
      records.set(key, next);
      return next;
    },
  };
}

function serviceWith(
  seed: AdminProjectRecord[] = [],
  invalidate: (change: { slug: string; previousSlug?: string }) => void = () =>
    undefined,
) {
  return createProjectService({
    store: memoryStore(seed),
    invalidate,
    now: () => new Date("2026-04-01T00:00:00.000Z"),
  });
}

describe("admin mutation authorization", () => {
  it("blocks unauthenticated and denied sessions before a write", () => {
    expect(authorizeAdminMutation({ status: "unauthenticated" })).toEqual({
      ok: false,
      code: "unauthorized",
    });
    expect(authorizeAdminMutation({ status: "denied" })).toEqual({
      ok: false,
      code: "unauthorized",
    });
    expect(authorizeAdminMutation({ status: "allowed", admin })).toEqual({
      ok: true,
      admin,
    });
  });
});

describe("project write validation", () => {
  const valid = {
    title: "Public app",
    slug: "public-app",
    summary: "A compact case study.",
    description: "",
    technologies: "TypeScript, Next.js",
    skillKeys: "skill-lorem",
    githubUrl: "https://github.com/example/app",
    demoUrl: "",
    internalNotes: "",
  };

  it("accepts required fields, lists, and optional http URLs", () => {
    const result = validateProjectWriteInput(valid);

    expect(result).toEqual({
      ok: true,
      value: {
        title: "Public app",
        slug: "public-app",
        summary: "A compact case study.",
        description: null,
        technologies: ["TypeScript", "Next.js"],
        skillKeys: ["skill-lorem"],
        githubUrl: "https://github.com/example/app",
        demoUrl: null,
        internalNotes: null,
      },
    });
  });

  it("rejects missing fields, invalid slugs, and unsafe URLs", () => {
    expect(validateProjectWriteInput({ ...valid, title: "" }).ok).toBe(false);
    expect(
      validateProjectWriteInput({ ...valid, slug: "Public App" }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { slug: "invalidSlug" },
    });
    expect(
      validateProjectWriteInput({ ...valid, githubUrl: "javascript:alert(1)" }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { githubUrl: "invalidUrl" },
    });
    expect(parseStringList("a, a, b\nc")).toEqual(["a", "b", "c"]);
  });
});

describe("project CMS service", () => {
  it("creates drafts that stay off the public catalog", async () => {
    const invalidate: { slug: string; previousSlug?: string }[] = [];
    const cms = serviceWith([], (change) => invalidate.push(change));
    const parsed = validateProjectWriteInput({
      title: "Public app",
      slug: "public-app",
      summary: "A compact case study.",
      description: "",
      technologies: "TypeScript",
      skillKeys: "skill-lorem",
      githubUrl: "",
      demoUrl: "",
      internalNotes: "do-not-leak",
    });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    const created = await cms.create(admin, parsed.value);

    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    expect(created.value.status).toBe("draft");
    expect(created.value.key).toBe("proj-public-app");
    expect(publishedProjects([created.value])).toEqual([]);
    expect(invalidate).toEqual([{ slug: "public-app" }]);
  });

  it("publishes and unpublishes without exposing drafts publicly", async () => {
    const cms = serviceWith([
      record({
        key: "proj-public-app",
        slug: "public-app",
        title: "Public app",
        status: "draft",
      }),
    ]);

    const published = await cms.publish(admin, "proj-public-app");
    expect(published.ok).toBe(true);
    if (!published.ok) {
      return;
    }

    expect(
      publishedProjects([published.value]).map((item) => item.slug),
    ).toEqual(["public-app"]);
    expect(JSON.stringify(publishedProjects([published.value]))).not.toContain(
      "admin-only",
    );

    const unpublished = await cms.unpublish(admin, "proj-public-app");
    expect(unpublished.ok).toBe(true);
    if (!unpublished.ok) {
      return;
    }

    expect(publishedProjects([unpublished.value])).toEqual([]);
  });

  it("archives instead of deleting and keeps the slug reserved", async () => {
    const cms = serviceWith([
      record({
        key: "proj-public-app",
        slug: "public-app",
        title: "Public app",
        status: "published",
        publishedAt: "2026-03-01T00:00:00.000Z",
      }),
    ]);

    const archived = await cms.archive(admin, "proj-public-app");
    expect(archived.ok).toBe(true);
    if (!archived.ok) {
      return;
    }

    expect(archived.value.status).toBe("archived");
    expect(publishedProjects([archived.value])).toEqual([]);
    expect((await cms.get("proj-public-app")).ok).toBe(true);

    const duplicate = await cms.create(admin, {
      title: "Copy",
      slug: "public-app",
      summary: "Another summary.",
      description: null,
      technologies: [],
      skillKeys: [],
      githubUrl: null,
      demoUrl: null,
      internalNotes: null,
    });

    expect(duplicate).toMatchObject({
      ok: false,
      code: "duplicateSlug",
    });
  });

  it("does not overwrite another project when a slug changes", async () => {
    const invalidate: { slug: string; previousSlug?: string }[] = [];
    const cms = serviceWith(
      [
        record({
          key: "proj-alpha",
          slug: "alpha",
          title: "Alpha",
          status: "draft",
        }),
        record({
          key: "proj-beta",
          slug: "beta",
          title: "Beta",
          status: "draft",
        }),
      ],
      (change) => invalidate.push(change),
    );

    const result = await cms.update(admin, "proj-alpha", {
      title: "Alpha",
      slug: "beta",
      summary: "A compact case study.",
      description: null,
      technologies: [],
      skillKeys: [],
      githubUrl: null,
      demoUrl: null,
      internalNotes: null,
    });

    expect(result).toMatchObject({
      ok: false,
      code: "duplicateSlug",
    });

    const moved = await cms.update(admin, "proj-alpha", {
      title: "Alpha renamed",
      slug: "alpha-renamed",
      summary: "A compact case study.",
      description: null,
      technologies: [],
      skillKeys: [],
      githubUrl: null,
      demoUrl: null,
      internalNotes: null,
    });

    expect(moved.ok).toBe(true);
    expect(invalidate).toContainEqual({
      slug: "alpha-renamed",
      previousSlug: "alpha",
    });
  });
});
