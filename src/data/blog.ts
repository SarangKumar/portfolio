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

export const posts: readonly BlogPost[] = [];
