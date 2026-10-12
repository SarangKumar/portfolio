import type { CollectionName } from "@/content/types";

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "list"
  | "lines"
  | "number"
  | "bool"
  | "json"
  | { options: string[] };
export type Field = {
  key: string;
  label: string;
  type: FieldType;
  /** Example shown as an input placeholder (never saved). */
  placeholder?: string;
};

const status: Field = {
  key: "status",
  label: "Status",
  type: { options: ["draft", "published"] },
};

export const SCHEMAS: Record<
  CollectionName,
  { label: string; titleKey: string; fields: Field[] }
> = {
  projects: {
    label: "Projects",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "year", label: "Year", type: "text" },
      {
        key: "kind",
        label: "Kind",
        type: { options: ["shipped", "in-progress", "idea"] },
      },
      { key: "order", label: "Order", type: "number" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "technologies",
        label: "Technologies (comma separated — feeds Skills)",
        type: "list",
      },
      { key: "demoUrl", label: "Live URL", type: "text" },
      { key: "githubUrl", label: "Source URL", type: "text" },
      {
        key: "diagramSlug",
        label: "Architecture Lab diagram slug",
        type: "text",
      },
      { key: "architecture", label: "Architecture", type: "markdown" },
      { key: "implementation", label: "Implementation", type: "markdown" },
      { key: "testing", label: "Testing", type: "markdown" },
      { key: "tradeoffs", label: "Trade-offs", type: "markdown" },
      {
        key: "sections",
        label: "Extra sections [{title, body}]",
        type: "json",
      },
      status,
    ],
  },
  posts: {
    label: "Articles & notes",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "kind", label: "Kind", type: { options: ["article", "note"] } },
      { key: "date", label: "Date (YYYY-MM-DD)", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "tags", label: "Tags", type: "list" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "body", label: "Body (markdown)", type: "markdown" },
      status,
    ],
  },
  books: {
    label: "Books",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "author", label: "Author", type: "text" },
      {
        key: "state",
        label: "State",
        type: { options: ["reading", "finished", "queued"] },
      },
      { key: "notes", label: "Reading notes", type: "textarea" },
      status,
    ],
  },
  bookmarks: {
    label: "Bookmarks",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "href", label: "URL", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "tags", label: "Tags", type: "list" },
      status,
    ],
  },
  notes: {
    label: "Ideas & notes",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      {
        key: "kind",
        label: "Kind",
        type: { options: ["idea", "engineering"] },
      },
      { key: "body", label: "Body", type: "textarea" },
      status,
    ],
  },
  skills: {
    label: "Skills",
    titleKey: "name",
    fields: [
      { key: "name", label: "Display name (rename)", type: "text" },
      {
        key: "aliases",
        label:
          "Aliases — project/experience tech with these names merge into this skill",
        type: "list",
      },
      {
        key: "category",
        label: "Category (group; order set in Site → skillCategories)",
        type: "text",
      },
      { key: "order", label: "Order within category", type: "number" },
      {
        key: "proficiency",
        label: "Proficiency",
        type: { options: ["", "expert", "proficient", "familiar"] },
      },
      {
        key: "featured",
        label: "Featured (shown first, emphasised)",
        type: "bool",
      },
      {
        key: "hidden",
        label: "Hidden (also hides matching derived tech)",
        type: "bool",
      },
      { key: "projects", label: "Extra linked project slugs", type: "list" },
      { key: "experience", label: "Extra linked experience ids", type: "list" },
      status,
    ],
  },
  experience: {
    label: "Experience",
    titleKey: "role",
    fields: [
      {
        key: "company",
        label: "Company (roles with the same company are grouped)",
        type: "text",
      },
      { key: "companyUrl", label: "Company link", type: "text" },
      { key: "role", label: "Role / title", type: "text" },
      { key: "employmentType", label: "Employment type", type: "text" },
      { key: "location", label: "Location", type: "text" },
      {
        key: "workplace",
        label: "Workplace (Hybrid / Remote / On-site)",
        type: "text",
      },
      { key: "start", label: "Start (YYYY-MM)", type: "text" },
      { key: "end", label: "End (YYYY-MM, empty = present)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "highlights",
        label: "Resume highlights (one per line)",
        type: "lines",
      },
      { key: "skills", label: "Skills (feed the skills view)", type: "list" },
      { key: "order", label: "Order", type: "number" },
      status,
    ],
  },
  diagrams: {
    label: "Diagrams",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "summary", label: "Summary", type: "textarea" },
      {
        key: "nodes",
        label: "Nodes [{id,label,kind,x,y,description}]",
        type: "json",
      },
      { key: "edges", label: "Edges [{id,from,to,label}]", type: "json" },
      {
        key: "flows",
        label: "Flows [{id,name,steps:[{edge,text}]}]",
        type: "json",
      },
      {
        key: "decisions",
        label: "Decisions [{title,body,nodes}]",
        type: "json",
      },
      { key: "tradeoffs", label: "Trade-offs", type: "json" },
      { key: "bottlenecks", label: "Bottlenecks", type: "json" },
      { key: "failures", label: "Failure scenarios", type: "json" },
      status,
    ],
  },
};

export const SITE_FIELDS: Field[] = [
  {
    key: "nav",
    label:
      "Navbar [{label, href}] — six destinations (routes: / /experience /projects /blogs /library /lab /board)",
    type: "json",
  },
  {
    key: "seo",
    label: "SEO {title, titleTemplate (use %s), description}",
    type: "json",
  },
  { key: "handle", label: "Terminal handle", type: "text" },
  {
    key: "experienceHref",
    label: "Experience link (Home + footer)",
    type: "text",
  },
  {
    key: "skillCategories",
    label: "Skill category order (comma separated)",
    type: "list",
  },
  {
    key: "pages",
    label:
      "Page intros {projects|blogs|library|lab|board: {eyebrow, title, intro}}",
    type: "json",
  },
  {
    key: "labels",
    label: "Labels & section titles (key → text, supports {placeholders})",
    type: "json",
  },
  { key: "name", label: "Name", type: "text" },
  { key: "role", label: "Role (hero headline)", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "intro", label: "Intro", type: "textarea" },
  { key: "about", label: "About", type: "textarea" },
  { key: "email", label: "Email", type: "text" },
  { key: "currentFocus", label: "Current focus (one per line)", type: "lines" },
  {
    key: "career",
    label:
      "Career / open to work {available,label,headline,detail,roles[],ctas[{label,href; href resume = PDF}],navIndicator}",
    type: "json",
  },
  {
    key: "featuredProjectSlugs",
    label: "Featured project slugs",
    type: "list",
  },
  {
    key: "featuredPostSlugs",
    label: "Featured post slugs (empty = latest)",
    type: "list",
  },
  {
    key: "homeSections",
    label:
      "Homepage sections {featured,focus,writing,skills,resume,experience}",
    type: "json",
  },
  { key: "links", label: "Links [{label, href}]", type: "json" },
];

export const RESUME_FIELDS: Field[] = [
  { key: "summary", label: "Summary", type: "textarea" },
  {
    key: "pdfUrl",
    label:
      "Downloadable PDF (path under /public, e.g. /resumes/cv.pdf, or a URL)",
    type: "text",
  },
  {
    key: "experience",
    label: "Experience [{company, role, location, period, bullets[]}]",
    type: "json",
  },
  {
    key: "education",
    label: "Education [{school, degree, period, detail}]",
    type: "json",
  },
  { key: "skills", label: "Skills [{group, items[]}]", type: "json" },
  { key: "achievements", label: "Highlights (one per line)", type: "lines" },
];

/**
 * Example values shown as input placeholders in /admin. Display-only hints:
 * they are never written to Firestore. A field's own `placeholder` wins.
 */
const j = (v: unknown) => JSON.stringify(v, null, 2);
export const PLACEHOLDERS: Record<string, string> = {
  title: "e.g. Designing a calm job-search pipeline",
  slug: "e.g. my-project (lowercase, hyphens)",
  year: "e.g. 2026",
  order: "e.g. 1 (lower shows first)",
  summary: "One or two sentences shown on cards and in search.",
  description: "A short paragraph describing what it is and why it exists.",
  technologies: "e.g. Next.js, TypeScript, Firestore",
  demoUrl: "https://example.com",
  githubUrl: "https://github.com/…",
  diagramSlug: "e.g. aavedak (slug of a Lab diagram)",
  architecture: "## Overview\nHow the pieces fit together (markdown).",
  implementation: "Key implementation details (markdown).",
  testing: "How it's tested: unit, e2e, CI (markdown).",
  tradeoffs: "What you chose and what it cost (markdown or JSON list).",
  sections: j([{ title: "Why", body: "Markdown body…" }]),
  date: "YYYY-MM-DD, e.g. 2026-10-12",
  category: "e.g. Engineering",
  tags: "e.g. nextjs, firebase, testing",
  excerpt: "One-sentence teaser shown in lists and OG images.",
  body: "# Heading\n\nWrite in markdown…",
  author: "e.g. Martin Kleppmann",
  notes: "What stuck with you…",
  href: "https://…",
  name: "e.g. Sarang Kumar / TypeScript",
  aliases: "e.g. TS, typescript",
  projects: "e.g. aavedak, vinyaas",
  experience: "e.g. exp-komprise-se",
  company: "e.g. Komprise",
  companyUrl: "https://www.linkedin.com/company/…",
  role: "e.g. Software Engineer",
  employmentType: "e.g. Full-time / Internship",
  location: "e.g. Bangalore, IN",
  start: "YYYY-MM, e.g. 2025-07",
  end: "YYYY-MM, leave empty for present",
  highlights: "One achievement per line, e.g. Cut build time 40%…",
  skills: "e.g. React, Go, AWS",
  nodes: j([
    {
      id: "api",
      label: "API",
      kind: "service",
      x: 300,
      y: 120,
      description: "…",
    },
  ]),
  edges: j([{ id: "e1", from: "web", to: "api", label: "HTTPS" }]),
  flows: j([
    { id: "login", name: "Sign in", steps: [{ edge: "e1", text: "…" }] },
  ]),
  decisions: j([
    { title: "Firestore over Postgres", body: "…", nodes: ["db"] },
  ]),
  bottlenecks: j([{ title: "Cold starts", body: "…", nodes: ["api"] }]),
  failures: j([
    { title: "Firestore down", body: "Falls back to seed", nodes: ["db"] },
  ]),
  nav: j([
    { label: "Home", href: "/" },
    { label: "Experience", href: "/experience" },
  ]),
  footerNav: j([{ label: "Library", href: "/library" }]),
  seo: j({
    title: "Name — Role",
    titleTemplate: "%s — Name",
    description: "…",
  }),
  handle: "e.g. sarang",
  experienceHref: "/experience",
  skillCategories: j(["Languages", "Frontend", "Backend & Databases", "Tools"]),
  pages: j({ projects: { title: "Things I've built", intro: "…" } }),
  labels: j({ "home.cta": "See the work", "terminal.status": "{career}" }),
  tagline: "e.g. Building calm, well-tested software for real users.",
  intro: "A short paragraph introducing yourself.",
  about: "A longer about-me paragraph.",
  email: "you@example.com",
  currentFocus: "One focus per line, e.g. Distributed systems",
  career: j({
    available: true,
    label: "Open to work",
    headline: "Open to SDE roles",
    detail: "Full-time, Bangalore or remote.",
    roles: ["Frontend", "Backend"],
    ctas: [{ label: "Download resume", href: "resume" }],
    navIndicator: true,
  }),
  featuredProjectSlugs: "e.g. vinyaas, aavedak",
  featuredPostSlugs: "e.g. portfolio-on-free-tier",
  homeSections: j({
    featured: true,
    focus: true,
    writing: true,
    skills: true,
    resume: true,
    experience: true,
  }),
  links: j([{ label: "GitHub", href: "https://github.com/…" }]),
  pdfUrl: "/resumes/your-resume.pdf or https://…",
  education: j([
    {
      school: "…",
      degree: "B.E. Computer Science",
      start: "2020-08",
      end: "2024-06",
    },
  ]),
  achievements: "One highlight per line",
  proficiency: "",
  kind: "",
};
