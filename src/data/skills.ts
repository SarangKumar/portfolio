export type SkillCategory = {
  id: string;
  label: string;
};

export type Skill = {
  id: string;
  name: string;
  categoryId: string;
};

export const skillCategories: readonly SkillCategory[] = [
  { id: "languages", label: "Languages" },
  { id: "databases", label: "Databases" },
  { id: "engineering", label: "Software Engineering" },
  { id: "testing", label: "Testing" },
  { id: "backend", label: "Backend & Cloud" },
  { id: "frontend", label: "Frontend & Tools" },
];

export const skills: readonly Skill[] = [
  { id: "skill-cpp", name: "C++", categoryId: "languages" },
  { id: "skill-java", name: "Java", categoryId: "languages" },
  { id: "skill-python", name: "Python", categoryId: "languages" },
  { id: "skill-javascript", name: "JavaScript", categoryId: "languages" },
  { id: "skill-typescript", name: "TypeScript", categoryId: "languages" },
  { id: "skill-sql", name: "SQL", categoryId: "languages" },
  { id: "skill-mysql", name: "MySQL", categoryId: "databases" },
  { id: "skill-mongodb", name: "MongoDB", categoryId: "databases" },
  {
    id: "skill-oop",
    name: "Object-Oriented Programming",
    categoryId: "engineering",
  },
  {
    id: "skill-dsa",
    name: "Data Structures & Algorithms",
    categoryId: "engineering",
  },
  { id: "skill-rest", name: "REST APIs", categoryId: "engineering" },
  {
    id: "skill-application-design",
    name: "Application Design",
    categoryId: "engineering",
  },
  { id: "skill-agile", name: "Agile Development", categoryId: "engineering" },
  { id: "skill-code-review", name: "Code Review", categoryId: "engineering" },
  { id: "skill-cicd", name: "CI/CD", categoryId: "engineering" },
  { id: "skill-jest", name: "Jest", categoryId: "testing" },
  { id: "skill-playwright", name: "Playwright", categoryId: "testing" },
  { id: "skill-unit-testing", name: "Unit Testing", categoryId: "testing" },
  {
    id: "skill-integration-testing",
    name: "Integration Testing",
    categoryId: "testing",
  },
  { id: "skill-ui-automation", name: "UI Automation", categoryId: "testing" },
  { id: "skill-nodejs", name: "Node.js", categoryId: "backend" },
  { id: "skill-express", name: "Express.js", categoryId: "backend" },
  { id: "skill-gcs", name: "Google Cloud Storage", categoryId: "backend" },
  { id: "skill-docker", name: "Docker", categoryId: "backend" },
  { id: "skill-react", name: "React", categoryId: "frontend" },
  { id: "skill-nextjs", name: "Next.js", categoryId: "frontend" },
  { id: "skill-redux", name: "Redux Toolkit", categoryId: "frontend" },
  { id: "skill-rtk-query", name: "RTK Query", categoryId: "frontend" },
  {
    id: "skill-tanstack-table",
    name: "TanStack Table",
    categoryId: "frontend",
  },
  { id: "skill-git", name: "Git", categoryId: "frontend" },
  { id: "skill-github", name: "GitHub", categoryId: "frontend" },
  { id: "skill-postman", name: "Postman", categoryId: "frontend" },
  { id: "skill-jquery", name: "jQuery", categoryId: "frontend" },
];
