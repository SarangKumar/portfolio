export type SkillCategory = {
  id: string;
  label: string;
};

export type Skill = {
  id: string;
  name: string;
  categoryId: string;
};

export const skillCategories: readonly SkillCategory[] = [];

export const skills: readonly Skill[] = [];
