import { describe, expect, it } from "@jest/globals";
import type { BlogPost } from "@/data/blog";
import type { ProjectItem } from "@/data/projects";
import { articleMetadata } from "@/lib/article-metadata";
import { projectMetadata } from "@/lib/project-metadata";
import {
  articleJsonLd,
  creativeWorkJsonLd,
  pageUrl,
  personJsonLd,
  publicSitemapEntries,
  shareMetadata,
  websiteJsonLd,
} from "@/lib/seo";

const project: ProjectItem = {
  id: "hidden-id",
  slug: "sample-app",
  title: "Sample app",
  summary: "A compact case study.",
  description: "Longer notes.",
  technologies: ["TypeScript"],
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

const post: BlogPost = {
  slug: "public-note",
  title: "Public note",
  description: "A published article.",
  content: "Hello",
  publishedAt: "2026-01-01",
  updatedAt: "2026-02-01",
  tags: ["engineering"],
  categories: ["notes"],
  coverImage: {
    src: "/blog/public-note.png",
    alt: "Notebook",
  },
};

describe("shareMetadata", () => {
  it("adds canonical, hreflang, Open Graph, and Twitter fields", () => {
    const metadata = shareMetadata({
      title: "About",
      description: "Background and focus.",
      path: "/about",
    });

    expect(metadata.alternates).toEqual({
      canonical: "http://localhost:3000/about",
      languages: {
        en: "http://localhost:3000/about",
        "x-default": "http://localhost:3000/about",
      },
    });
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title: "About",
      url: "http://localhost:3000/about",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary",
      title: "About",
    });
  });
});

describe("dynamic page metadata", () => {
  it("exposes article Open Graph and Twitter fields", () => {
    const metadata = articleMetadata(post);

    expect(metadata.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-01-01",
      modifiedTime: "2026-02-01",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
    });
  });

  it("treats project pages as website Open Graph, not articles", () => {
    const metadata = projectMetadata(project);

    expect(metadata.openGraph).toMatchObject({
      type: "website",
    });
    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/projects/sample-app",
    );
  });
});

describe("sitemap and structured data", () => {
  it("lists public routes and published sample detail URLs", () => {
    const urls = publicSitemapEntries().map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        pageUrl("/"),
        "http://localhost:3000/about",
        "http://localhost:3000/contact",
        "http://localhost:3000/projects/lorem-gateway",
        "http://localhost:3000/blog/notes-on-lorem",
      ]),
    );
    expect(urls).toContain("http://localhost:3000/blog");
  });

  it("emits WebSite JSON-LD and Person data from the sample profile", () => {
    expect(websiteJsonLd("Personal engineering portfolio")["@type"]).toBe(
      "WebSite",
    );
    expect(personJsonLd()).toMatchObject({
      "@type": "Person",
      name: "Lorem Ipsum",
    });
  });

  it("emits Article and CreativeWork JSON-LD for detail pages", () => {
    expect(
      articleJsonLd(post, "http://localhost:3000/blog/public-note"),
    ).toMatchObject({
      "@type": "Article",
      headline: "Public note",
    });
    expect(
      creativeWorkJsonLd(project, "http://localhost:3000/projects/sample-app"),
    ).toMatchObject({
      "@type": "SoftwareSourceCode",
      codeRepository: "https://github.com/example/sample-app",
    });
  });
});
