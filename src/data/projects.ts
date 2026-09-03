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

/**
 * Sample projects. Slugs are public; ids stay out of URLs.
 * Links use example.com, not real products.
 */
export const projects: readonly ProjectItem[] = [
  {
    id: "proj-lorem-gateway",
    slug: "lorem-gateway",
    title: "Lorem Gateway",
    summary: "A compact sample case study used to exercise the project layout.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec sed odio dui.",
    technologies: ["Lorem", "TypeScript", "Next.js"],
    skillIds: ["skill-lorem", "skill-dolor", "skill-consectetur"],
    githubUrl: "https://example.com/code/lorem-gateway",
    demoUrl: "https://example.com/demo/lorem-gateway",
    media: [],
    architecture:
      "Maecenas sed diam eget risus varius blandit sit amet non magna. Nested routes, typed catalogs, and placeholder media.",
    problem:
      "Nullam quis risus eget urna mollis ornare vel eu leo. Pages needed realistic length without real product claims.",
    solution:
      "Cras justo odio, dapibus ac facilisis in, egestas eget quam. Structured fields with lorem copy.",
    challenges:
      "Keeping internal ids out of URLs while still linking skills and roles.",
    decisions:
      "Public slugs only. Evidence counts instead of proficiency bars.",
    tradeoffs: "No screenshots until real media is published.",
    testing: "Catalog helpers and ranking covered in unit tests.",
    performance: "Static generation for published slugs.",
    futureImprovements: "Replace this copy with a real case study.",
    sections: [
      {
        id: "notes",
        title: "Notes",
        body: "Vestibulum id ligula porta felis euismod semper. Additional lorem for the optional sections list.",
      },
    ],
    experienceIds: ["exp-lorem-labs"],
  },
  {
    id: "proj-ipsum-ledger",
    slug: "ipsum-ledger",
    title: "Ipsum Ledger",
    summary:
      "Second sample project so ranking and grids have more than one card.",
    description:
      "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi leo risus, porta ac consectetur ac.",
    technologies: ["Ipsum", "React"],
    skillIds: ["skill-ipsum", "skill-sit"],
    githubUrl: null,
    demoUrl: "https://example.com/demo/ipsum-ledger",
    media: [],
    architecture: "A narrow sample architecture note for the detail page.",
    problem: "Need a second slug for sitemap and static params.",
    solution:
      "Publish another lorem project with fewer case-study fields filled.",
    challenges: null,
    decisions: null,
    tradeoffs: null,
    testing: null,
    performance: null,
    futureImprovements: null,
    sections: [],
    experienceIds: ["exp-ipsum-collective"],
  },
  {
    id: "proj-dolor-canvas",
    slug: "dolor-canvas",
    title: "Dolor Canvas",
    summary: "Third sample so the home ranking can show a top three.",
    description:
      "Donec ullamcorper nulla non metus auctor fringilla. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
    technologies: ["Dolor", "SVG"],
    skillIds: ["skill-dolor", "skill-adipiscing"],
    githubUrl: "https://example.com/code/dolor-canvas",
    demoUrl: null,
    media: [],
    architecture: null,
    problem: "Charts and featured lists need at least three titled items.",
    solution: "Add a third lorem project with mixed empty case-study fields.",
    challenges: "Empty media should not invent screenshots.",
    decisions: null,
    tradeoffs: "Demo URL left unpublished.",
    testing: null,
    performance: null,
    futureImprovements: null,
    sections: [],
    experienceIds: ["exp-lorem-labs"],
  },
];
