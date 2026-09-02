import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { ArticleCard } from "@/components/content/article-card";
import { ArticleGrid } from "@/components/content/article-grid";
import type { BlogPost } from "@/data/blog";

const sample: BlogPost = {
  slug: "public-note",
  title: "Public note",
  description: "A compact note.",
  content: "# Heading\n\nHello **world**.",
  publishedAt: "2024-01-01",
  updatedAt: null,
  tags: ["nextjs"],
  categories: ["notes"],
  coverImage: null,
};

describe("ArticleCard", () => {
  it("links with the public slug", () => {
    render(
      <ArticleCard
        post={sample}
        dateLabel="Published Jan 1, 2024"
        readingLabel="1 min read"
        tagsLabel="Tags"
      />,
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/blog/public-note",
    );
    expect(screen.getByText("nextjs")).toBeInTheDocument();
  });
});

describe("ArticleGrid", () => {
  it("renders the empty state when no posts are published", () => {
    render(
      <ArticleGrid
        posts={[]}
        dateLabel={() => "date"}
        readingLabel={() => "read"}
        tagsLabel="Tags"
        empty={<p>Articles will be listed here when they are published.</p>}
      />,
    );

    expect(
      screen.getByText("Articles will be listed here when they are published."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
