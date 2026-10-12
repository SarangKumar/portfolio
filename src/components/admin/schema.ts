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
export type Field = { key: string; label: string; type: FieldType };

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
      { key: "name", label: "Name", type: "text" },
      { key: "category", label: "Category", type: "text" },
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
      "Navbar [{label, href}] — keep the six routes: / /projects /blogs /library /lab /board",
    type: "json",
  },
  {
    key: "seo",
    label: "SEO {title, titleTemplate (use %s), description}",
    type: "json",
  },
  { key: "handle", label: "Terminal handle", type: "text" },
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
    label: "Career status {available,label,detail}",
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
    label: "Homepage sections {featured,focus,writing,skills}",
    type: "json",
  },
  { key: "links", label: "Links [{label, href}]", type: "json" },
];
