export const publicContentCacheTags = {
  projects: "public-content:projects",
  experience: "public-content:experience",
  skills: "public-content:skills",
  blog: "public-content:blog",
  resumes: "public-content:resumes",
  credentials: "public-content:credentials",
} as const;

export type PublicContentCacheTag =
  (typeof publicContentCacheTags)[keyof typeof publicContentCacheTags];
