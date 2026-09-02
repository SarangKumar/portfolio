export type ProjectMedia = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  kind?: "image" | "video";
};

export type ProjectCaseStudySection = {
  id: string;
  title: string;
  body: string;
};

export type ProjectItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  technologies: readonly string[];
  skillIds: readonly string[];
  githubUrl: string | null;
  demoUrl: string | null;
  media: readonly ProjectMedia[];
  architecture: string | null;
  problem: string | null;
  solution: string | null;
  challenges: string | null;
  decisions: string | null;
  tradeoffs: string | null;
  testing: string | null;
  performance: string | null;
  futureImprovements: string | null;
  sections: readonly ProjectCaseStudySection[];
  experienceIds: readonly string[];
};

export const projects: readonly ProjectItem[] = [];
