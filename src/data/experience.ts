/**
 * Sample public experience. Company names are placeholder copy, not real employers.
 */
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
    id: "exp-lorem-labs",
    company: "Lorem Labs",
    role: "Placeholder Engineer",
    startDate: "2022-03",
    endDate: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper.",
    technologies: ["Lorem", "TypeScript", "Next.js"],
    skillIds: ["skill-lorem", "skill-dolor", "skill-consectetur"],
    projectIds: ["proj-lorem-gateway", "proj-dolor-canvas"],
    achievements: [
      "Shipped the lorem gateway layout with linked project evidence.",
      "Documented ipsum copy so pages stay replaceable.",
    ],
  },
  {
    id: "exp-ipsum-collective",
    company: "Ipsum Collective",
    role: "Interface Artisan",
    startDate: "2019-08",
    endDate: "2022-02",
    description:
      "Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod.",
    technologies: ["Ipsum", "React"],
    skillIds: ["skill-ipsum", "skill-sit", "skill-adipiscing"],
    projectIds: ["proj-ipsum-ledger"],
    achievements: [
      "Mapped sit amet skills to public roles instead of score bars.",
    ],
  },
];
