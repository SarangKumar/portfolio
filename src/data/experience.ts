/**
 * Public portfolio experience only.
 * Private career records belong in a separate system later.
 */
export type PublicExperience = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  skillIds: readonly string[];
  projectIds: readonly string[];
  achievements: readonly string[];
};

export const experience: readonly PublicExperience[] = [];
