/**
 * Public identity from the 2026 SDE resume.
 */
export type Profile = {
  displayName: string | null;
  headline: string | null;
  summary: string | null;
  background: string | null;
  philosophy: string | null;
  focusSkillIds: readonly string[];
  expertiseSkillIds: readonly string[];
  interests: readonly string[];
};

export const profile: Profile = {
  displayName: "Sarang Kumar",
  headline: "Software Engineer at Komprise",
  summary:
    "Software Engineer with experience developing and supporting enterprise-scale applications across frontend, backend, and systems environments. Experienced in application development, REST APIs, relational and NoSQL databases, object-oriented programming, automated testing, CI/CD, production debugging, and Agile development.",
  background:
    "Based in Bangalore. B.Tech in Computer Science Engineering from PES University (CGPA 8.81/10, 2021–2025). At Komprise, contributed to customer-facing production systems, cloud-storage workflows, reusable application infrastructure, production hotfixes, and automated testing. Earlier completed rotational engineering training across Frontend, Backend, and Systems teams.",
  philosophy:
    "Prefer reusable application infrastructure, automated regression coverage, and production-ready delivery. Work in short Agile release cycles with code review, testing, and root-cause analysis before a change ships.",
  focusSkillIds: [
    "skill-typescript",
    "skill-react",
    "skill-nodejs",
    "skill-playwright",
  ],
  expertiseSkillIds: [
    "skill-javascript",
    "skill-rest",
    "skill-mongodb",
    "skill-mysql",
    "skill-jest",
    "skill-docker",
  ],
  interests: [
    "UI and integration automation",
    "Cloud-storage application workflows",
    "Reusable frontend infrastructure",
    "Production debugging",
  ],
};
