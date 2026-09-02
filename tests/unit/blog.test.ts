import { describe, expect, it } from "@jest/globals";
import type { BlogPost } from "@/data/blog";
import { articleMetadata } from "@/lib/article-metadata";
import {
  articleHref,
  getPostBySlug,
  readingTimeMinutes,
  sortPostsByDate,
} from "@/lib/blog";

function post(
  overrides: Pick<BlogPost, "slug" | "title"> & Partial<BlogPost>,
): BlogPost {
  return {
    description: "A public note.",
    content: "Hello world.",
    publishedAt: "2024-01-01",
    updatedAt: null,
    tags: [],
    categories: [],
    coverImage: null,
    ...overrides,
  };
}

describe("blog slugs", () => {
  it("builds public article paths from slugs", () => {
    expect(articleHref("public-note")).toBe("/blog/public-note");
  });

  it("looks up posts by slug and rejects invalid slugs", () => {
    const items = [post({ slug: "public-note", title: "Public note" })];

    expect(getPostBySlug("public-note", items)?.title).toBe("Public note");
    expect(getPostBySlug("Public-Note", items)).toBeUndefined();
  });

  it("sorts newest published dates first", () => {
    const items = [
      post({ slug: "older", title: "Older", publishedAt: "2023-01-01" }),
      post({ slug: "newer", title: "Newer", publishedAt: "2024-06-01" }),
    ];

    expect(sortPostsByDate(items).map((item) => item.slug)).toEqual([
      "newer",
      "older",
    ]);
  });
});

describe("readingTimeMinutes", () => {
  it("rounds up at 200 words per minute with a one-minute floor", () => {
    expect(readingTimeMinutes("")).toBe(1);
    expect(readingTimeMinutes("one two three")).toBe(1);
    expect(
      readingTimeMinutes(Array.from({ length: 201 }, () => "word").join(" ")),
    ).toBe(2);
  });
});

describe("articleMetadata", () => {
  it("uses article Open Graph fields and the public slug", () => {
    const metadata = articleMetadata(
      post({
        slug: "public-note",
        title: "Public note",
        description: "A compact note.",
        publishedAt: "2024-02-02",
        updatedAt: "2024-03-03",
        tags: ["nextjs"],
        coverImage: { src: "/blog/cover.png", alt: "Cover" },
      }),
    );

    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/blog/public-note",
    );
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      url: "http://localhost:3000/blog/public-note",
      publishedTime: "2024-02-02",
      modifiedTime: "2024-03-03",
    });
    expect(JSON.stringify(metadata)).not.toContain("hidden-id");
  });
});
