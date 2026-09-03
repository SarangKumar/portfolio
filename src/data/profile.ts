/**
 * Sample placeholder profile for layout and integration.
 * Replace with published identity before going live.
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
  displayName: "Lorem Ipsum",
  headline: "Placeholder engineer for demonstration layouts.",
  summary:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
  background:
    "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nullam id dolor id nibh ultricies vehicula ut id elit.",
  philosophy:
    "Cras mattis consectetur purus sit amet fermentum. Prefer small interfaces and copy that can be replaced without rewriting the layout.",
  focusSkillIds: ["skill-lorem", "skill-dolor"],
  expertiseSkillIds: ["skill-ipsum", "skill-consectetur"],
  interests: ["Lorem layouts", "Ipsum copy systems", "Dolor charts"],
};
