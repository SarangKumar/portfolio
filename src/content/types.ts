/**
 * Shared content model. The public site, the terminal, the ⌘K palette and the
 * admin panel all read these shapes, from Firestore when configured and from
 * `seed.ts` otherwise.
 */
export type Status = "draft" | "published";

export type Link = { label: string; href: string };

export type PageKey = "projects" | "blogs" | "library" | "lab" | "board";
export type PageCopy = { eyebrow: string; title: string; intro: string };

export type SiteConfig = {
  /** Navbar destinations, in order. Labels editable; hrefs are the six routes. */
  nav: Link[];
  /** Where Home/footer link the resume. */
  resumeHref: string;
  seo: { title: string; titleTemplate: string; description: string };
  /** Short handle used by the terminal banner/prompt. */
  handle: string;
  pages: Record<PageKey, PageCopy>;
  /** Content-like labels and section titles, keyed by `area.name`. Supports {placeholders}. */
  labels: Record<string, string>;
  name: string;
  role: string;
  location: string;
  tagline: string;
  intro: string;
  about: string;
  currentFocus: string[];
  career: { available: boolean; label: string; detail: string };
  email: string;
  links: Link[];
  featuredProjectSlugs: string[];
  featuredPostSlugs: string[];
  homeSections: {
    featured: boolean;
    focus: boolean;
    writing: boolean;
    skills: boolean;
    resume: boolean;
  };
};

export type CaseSection = { title: string; body: string };

export type Project = {
  id: string;
  slug: string;
  title: string;
  /** Path under /public to the project's app icon. */
  icon?: string;
  year: string;
  summary: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  kind: "shipped" | "in-progress" | "idea";
  architecture: string;
  implementation: string;
  testing: string;
  tradeoffs: string;
  sections: CaseSection[];
  diagramSlug?: string;
  status: Status;
  order: number;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  kind: "article" | "note";
  date: string;
  status: Status;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  state: "reading" | "finished" | "queued";
  notes: string;
  status: Status;
};

export type Bookmark = {
  id: string;
  title: string;
  href: string;
  description: string;
  tags: string[];
  status: Status;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  kind: "idea" | "engineering";
  status: Status;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  status: Status;
};

export type DiagramNode = {
  id: string;
  label: string;
  kind: "client" | "edge" | "service" | "data" | "external";
  x: number;
  y: number;
  description: string;
};
export type DiagramEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
};
export type DiagramFlow = {
  id: string;
  name: string;
  steps: { edge: string; text: string }[];
};
export type DiagramPoint = { title: string; body: string; nodes: string[] };

export type Diagram = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  flows: DiagramFlow[];
  decisions: DiagramPoint[];
  tradeoffs: DiagramPoint[];
  bottlenecks: DiagramPoint[];
  failures: DiagramPoint[];
  status: Status;
};

export type Comment = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
};

export type ResumeRole = {
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
};
export type ResumeEducation = {
  school: string;
  degree: string;
  period: string;
  detail: string;
};
export type Resume = {
  summary: string;
  /** Public path or URL of the downloadable PDF, e.g. /resumes/cv.pdf */
  pdfUrl: string;
  experience: ResumeRole[];
  education: ResumeEducation[];
  skills: { group: string; items: string[] }[];
  achievements: string[];
};

export type Content = {
  resume: Resume;
  site: SiteConfig;
  projects: Project[];
  posts: Post[];
  books: Book[];
  bookmarks: Bookmark[];
  notes: Note[];
  skills: Skill[];
  diagrams: Diagram[];
};

export const COLLECTIONS = [
  "projects",
  "posts",
  "books",
  "bookmarks",
  "notes",
  "skills",
  "diagrams",
] as const;
export type CollectionName = (typeof COLLECTIONS)[number];
