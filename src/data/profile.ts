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
  displayName: null,
  headline: null,
  summary: null,
  background: null,
  philosophy: null,
  focusSkillIds: [],
  expertiseSkillIds: [],
  interests: [],
};
