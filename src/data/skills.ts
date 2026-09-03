/**
 * Sample skill catalog. Names are lorem labels, not proficiency scores.
 */
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
  { id: "platforms", label: "Platforms" },
  { id: "practices", label: "Practices" },
];

export const skills: readonly Skill[] = [
  { id: "skill-lorem", name: "Lorem", categoryId: "languages" },
  { id: "skill-ipsum", name: "Ipsum", categoryId: "languages" },
  { id: "skill-dolor", name: "Dolor", categoryId: "platforms" },
  { id: "skill-sit", name: "Sit Amet", categoryId: "platforms" },
  { id: "skill-consectetur", name: "Consectetur", categoryId: "practices" },
  { id: "skill-adipiscing", name: "Adipiscing", categoryId: "practices" },
];
