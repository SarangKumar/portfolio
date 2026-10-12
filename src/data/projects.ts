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

export const projects: readonly ProjectItem[] = [
  {
    id: "proj-aavedak",
    slug: "aavedak",
    title: "Aavedak",
    summary:
      "A personal job-search operating system: resume and cover-letter generation with ATS scoring, job discovery, Gmail-based outreach tracking, and an end-to-end application pipeline.",
    description:
      'अवसर — "opportunity." Aavedak recommends and prepares; the user decides and sends. A pnpm monorepo with a Next.js web app, a FastAPI backend, and a browser extension, built around one workflow: onboarding, resume, dashboard, job discovery, cover letters, ATS scoring, referrals, applying, tracking, and follow-up. Its interface is built with Vinyaas — the same component system this portfolio is built with.',
    technologies: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Python",
      "Neon Postgres",
      "Tailwind CSS",
      "Vinyaas",
    ],
    skillIds: [
      "skill-nextjs",
      "skill-typescript",
      "skill-javascript",
      "skill-python",
      "skill-rest",
      "skill-application-design",
    ],
    githubUrl: "https://github.com/SarangKumar/aavedak",
    demoUrl: "https://aavedak.vercel.app",
    media: [],
    architecture:
      "Three services in one monorepo: a Next.js app (apps/web) for the product surface, a FastAPI service (apps/api) for ATS scoring, job discovery, and Gmail integration, and a browser extension (apps/extension) for capturing job postings while browsing. Neon Postgres is the shared data store.",
    problem:
      "Job searching is scattered across a resume, a spreadsheet of applications, a dozen browser tabs of postings, and an inbox of recruiter email — with no single place tracking what was sent, to whom, and what happened next.",
    solution:
      "One pipeline from discovery to follow-up: find postings, tailor a resume and cover letter against each one with ATS scoring, track outreach through Gmail, and follow every application through to an outcome.",
    challenges:
      "Keeping three separate services (web, API, extension) consistent on one data model and one design system, and building ATS scoring that is actually useful rather than a black-box number.",
    decisions:
      "Split ATS scoring and job discovery into a Python service so the matching and scraping logic isn't entangled with the Next.js app; used Vinyaas for the UI so the design system is reusable across this project and others.",
    tradeoffs: null,
    testing: null,
    performance: null,
    futureImprovements: null,
    sections: [],
    experienceIds: [],
  },
  {
    id: "proj-vinyaas",
    slug: "vinyaas",
    title: "Vinyaas",
    summary:
      "A registry-driven CLI that installs customizable, Tailwind CSS v4 React components as source files into a project — not a runtime package.",
    description:
      "Vinyaas copies components (button, dialog, navigation menu, resizable panels, command palette, charts, data tables, and more — 56 in the current registry) straight into a project's own source tree, in the shadcn/ui tradition. init, add, list, search, info, doctor, and update commands cover setup, discovery, and upgrades. Published to npm as vinyaas, currently at v1.4.0. This portfolio's UI is built with it.",
    technologies: [
      "TypeScript",
      "Next.js",
      "Tailwind CSS v4",
      "Node.js",
      "class-variance-authority",
    ],
    skillIds: [
      "skill-typescript",
      "skill-javascript",
      "skill-nextjs",
      "skill-application-design",
    ],
    githubUrl: "https://github.com/SarangKumar/shilp",
    demoUrl: "https://vinyaas.vercel.app",
    media: [],
    architecture:
      "A pnpm monorepo: packages/cli is the published CLI (built with esbuild), apps/docs is the Next.js registry and documentation site. The CLI resolves a consumer project's tsconfig/jsconfig path aliases, fetches registry JSON from the docs site's /r endpoint, and writes component source plus any CSS variables or dependencies the component declares.",
    problem:
      "Component libraries that ship as npm packages are easy to install but hard to actually customize — real changes mean fighting the library's API instead of just editing the component.",
    solution:
      "Treat components as code you own: the CLI copies the source into the project once, so every component can be edited directly like any other file, with no abstraction layer to work around.",
    challenges:
      "Keeping an accessibility contract (correct ARIA roles, keyboard behavior, focus management) consistent across 56 independently-installable components, and resolving each consumer project's own alias and Tailwind setup reliably across Next.js, Vite, and plain React.",
    decisions:
      "Components are grouped by registry category rather than framework version, so `vinyaas add --category forms` installs a coherent set at once; CSS variables are only touched when a component actually declares them, so unrelated theme tokens are never overwritten.",
    tradeoffs: null,
    testing: null,
    performance: null,
    futureImprovements: null,
    sections: [],
    experienceIds: [],
  },
  {
    id: "proj-slack-shift-manager",
    slug: "slack-shift-manager",
    title: "Slack Shift Manager",
    summary:
      "Python automation that tracks engineer availability and allocates support tickets through Slack.",
    description:
      "A Python utility adopted by 12 support engineers at Komprise. It applies object-oriented design and MySQL-backed data management to automate availability tracking and ticket allocation, replacing recurring manual manager coordination.",
    technologies: ["Python", "OOP", "MySQL", "Slack API"],
    skillIds: [
      "skill-python",
      "skill-oop",
      "skill-mysql",
      "skill-application-design",
    ],
    githubUrl: null,
    demoUrl: null,
    media: [],
    architecture:
      "Object-oriented Python service with MySQL for engineer matching and ticket distribution, plus Slack reactions for real-time success and failure feedback.",
    problem:
      "Support managers were coordinating engineer availability and ticket assignment by hand.",
    solution:
      "A database-driven matching workflow that posts allocation results back to Slack.",
    challenges:
      "Keeping allocation feedback immediate for on-call engineers without adding another dashboard.",
    decisions:
      "Use Slack reactions as the operator interface instead of a separate UI.",
    tradeoffs:
      "The repository is internal, so there is no public source or demo URL.",
    testing: null,
    performance: null,
    futureImprovements: null,
    sections: [],
    experienceIds: ["exp-komprise-engineer"],
  },
  {
    id: "proj-fest-platforms",
    slug: "fest-platforms",
    title: "Aatmatrisha & dotSlash 5.0",
    summary:
      "Event platforms for PES University’s techno-cultural fest and a 24-hour hackathon.",
    description:
      "As Technical Head for Aatmatrisha, led technical execution for PES University’s annual techno-cultural fest serving 5,000+ attendees. Also built the dotSlash 5.0 platform for a 24-hour hackathon with 140+ participants, including QR-based ticketing for verification and check-in.",
    technologies: ["Next.js", "MongoDB", "Web Applications"],
    skillIds: [
      "skill-nextjs",
      "skill-mongodb",
      "skill-javascript",
      "skill-application-design",
    ],
    githubUrl: null,
    demoUrl: null,
    media: [],
    architecture:
      "Next.js web applications with MongoDB-backed attendee and ticketing data, including a QR check-in flow for the hackathon.",
    problem:
      "Large campus events needed reliable registration, verification, and day-of operations.",
    solution:
      "Purpose-built platforms for fest operations and hackathon ticketing rather than generic form tools.",
    challenges:
      "Supporting thousands of attendees and a 24-hour hackathon check-in window.",
    decisions: "QR tickets for attendee verification at the door.",
    tradeoffs:
      "Event-specific deployments rather than a general ticketing product.",
    testing: null,
    performance: null,
    futureImprovements: null,
    sections: [],
    experienceIds: ["exp-pes-university"],
  },
  {
    id: "proj-notevault",
    slug: "notevault",
    title: "NoteVault",
    summary:
      "Developer-focused notes with Markdown, authentication, and contextual linking.",
    description:
      "Open-source note-taking platform with Markdown editing, authentication, and interconnected note navigation. Emphasis on maintainable architecture and usability. 26+ GitHub stars.",
    technologies: ["Next.js", "MongoDB", "Markdown", "Authentication", "SEO"],
    skillIds: [
      "skill-nextjs",
      "skill-mongodb",
      "skill-javascript",
      "skill-application-design",
    ],
    githubUrl: "https://github.com/Nexus-PES/NoteVault",
    demoUrl: null,
    media: [],
    architecture:
      "Next.js application with MongoDB persistence, authenticated sessions, and Markdown-based note graphs.",
    problem:
      "Developer notes are hard to keep connected when they live as isolated files.",
    solution:
      "Contextual note-linking and Markdown editing in a single authenticated workspace.",
    challenges: "Keeping navigation usable as the note graph grows.",
    decisions: "Markdown as the editing surface; publish as open source.",
    tradeoffs: "No official hosted demo on this site.",
    testing: null,
    performance: "Public SEO for the project presence.",
    futureImprovements: null,
    sections: [],
    experienceIds: ["exp-pes-university"],
  },
];
