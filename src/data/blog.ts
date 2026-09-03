export type BlogCoverImage = {
  src: string;
  alt: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  updatedAt: string | null;
  tags: readonly string[];
  categories: readonly string[];
  coverImage: BlogCoverImage | null;
};

/**
 * Sample writing. Markdown is lorem; cover images stay unpublished.
 */
export const posts: readonly BlogPost[] = [
  {
    slug: "notes-on-lorem",
    title: "Notes on Lorem",
    description:
      "A sample article so the writing index, detail route, and JSON-LD have real length.",
    content: `## Lorem

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.

## Ipsum

Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.

- Dolor sit amet
- Consectetur adipiscing
- Elit integer posuere
`,
    publishedAt: "2026-01-12",
    updatedAt: "2026-03-04",
    tags: ["lorem", "layout"],
    categories: ["notes"],
    coverImage: null,
  },
  {
    slug: "ipsum-without-context",
    title: "Ipsum Without Context",
    description: "Second sample post so the blog grid is not a single card.",
    content: `Ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.

Nullam quis risus eget urna mollis ornare vel eu leo. Donec sed odio dui.
`,
    publishedAt: "2025-11-02",
    updatedAt: null,
    tags: ["ipsum"],
    categories: ["notes"],
    coverImage: null,
  },
];
