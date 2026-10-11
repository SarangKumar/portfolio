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
