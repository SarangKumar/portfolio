export type PublicExperience = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  technologies: readonly string[];
  skillIds: readonly string[];
  projectIds: readonly string[];
  achievements: readonly string[];
};

export const experience: readonly PublicExperience[] = [
  {
    id: "exp-komprise-engineer",
    company: "Komprise India Private Limited",
    role: "Software Engineer",
    startDate: "2025-07",
    endDate: null,
    description:
      "Contribute to customer-facing production systems at Komprise in Bangalore: cloud-storage workflows, reusable application infrastructure, production hotfixes, and automated testing. Work in roughly two-month Agile release cycles with engineering, UX, and business stakeholders.",
    technologies: [
      "React",
      "JavaScript",
      "Redux Toolkit",
      "RTK Query",
      "Jest",
      "Playwright",
      "REST APIs",
    ],
    skillIds: [
      "skill-react",
      "skill-javascript",
      "skill-redux",
      "skill-rtk-query",
      "skill-rest",
      "skill-jest",
      "skill-playwright",
      "skill-gcs",
      "skill-agile",
      "skill-cicd",
    ],
    projectIds: ["proj-slack-shift-manager"],
    achievements: [
      "Integrated Google Cloud Storage filer and bucket onboarding into production as a customer-critical hotfix, supporting cloud-storage adoption and contributing to retention of customer contracts worth approximately $200,000 annually.",
      "Built the Alerts Center in React with Redux Toolkit, RTK Query, REST data flows, advanced filtering, global search, protected routing, and table-based management for 12 months of operational history.",
      "Modernized legacy modules and shared components, removing deprecated dependencies and reducing bundle size by about 120 KB.",
      "Introduced Playwright UI/integration automation and Jest unit tests, expanding regression coverage for frequent production releases.",
      "Designed reusable frontend components and shared UI infrastructure used across multiple product areas.",
      "Debugged application issues across development, test, and production; collaborated with 5+ cross-functional stakeholders and independently delivered features.",
    ],
  },
  {
    id: "exp-komprise-intern",
    company: "Komprise India Private Limited",
    role: "Software Engineer Intern",
    startDate: "2025-01",
    endDate: "2025-06",
    description:
      "Completed rotational engineering training across Frontend, Backend, and Systems teams. Contributed to enterprise Data Store workflows, common application infrastructure, and internal operational platforms.",
    technologies: ["jQuery", "JavaScript", "Jest"],
    skillIds: [
      "skill-javascript",
      "skill-jquery",
      "skill-jest",
      "skill-agile",
      "skill-application-design",
    ],
    projectIds: [],
    achievements: [
      "Built an internal utility platform with jQuery to monitor usage metrics, license expiration, and resource over-usage across 450+ customer accounts.",
      "Wrote Jest unit tests for core utility functions to improve reliability.",
    ],
  },
  {
    id: "exp-pes-university",
    company: "PES University",
    role: "B.Tech, Computer Science Engineering",
    startDate: "2021-08",
    endDate: "2025-06",
    description:
      "Bachelor of Technology in Computer Science Engineering. CGPA 8.81/10. Served as Technical Head for Aatmatrisha, PES University’s annual techno-cultural fest.",
    technologies: ["Next.js", "MongoDB", "Python"],
    skillIds: [
      "skill-nextjs",
      "skill-mongodb",
      "skill-python",
      "skill-javascript",
    ],
    projectIds: ["proj-fest-platforms", "proj-notevault"],
    achievements: [
      "CGPA 8.81/10.",
      "Led technical execution for Aatmatrisha, supporting 5,000+ attendees.",
      "Built the dotSlash 5.0 hackathon platform for 140+ participants.",
    ],
  },
];
