/**
 * Public identity from the 2026 SDE resume.
 */
export type ProfileHighlight = {
  value: string;
  label: string;
};

export type Profile = {
  displayName: string | null;
  headline: string | null;
  summary: string | null;
  background: string | null;
  philosophy: string | null;
  focusSkillIds: readonly string[];
  expertiseSkillIds: readonly string[];
  interests: readonly string[];
  /** A handful of concrete numbers already stated in `experience.ts`
   * achievements, restated for a stat strip (e.g. on /resume). Keep these
   * traceable to an actual achievement line — don't add a figure that isn't
   * backed by one. */
  highlights: readonly ProfileHighlight[];
};

export const profile: Profile = {
  displayName: "Sarang Kumar",
  headline: "Software Engineer",
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
  highlights: [
    {
      value: "$200K+",
      label: "in customer contracts retained by a production hotfix",
    },
    { value: "450+", label: "customer accounts monitored by an internal tool" },
    { value: "5,000+", label: "attendees supported as a fest Technical Head" },
    { value: "8.81/10", label: "CGPA in Computer Science Engineering" },
  ],
};
