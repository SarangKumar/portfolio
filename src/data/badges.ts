export type BadgeCredential = {
  id: string;
  name: string;
  issuer: string;
  date: string | null;
  verificationUrl: string | null;
  imageSrc: string | null;
  skillIds: readonly string[];
};

export const badges: readonly BadgeCredential[] = [
  {
    id: "badge-dolor",
    name: "Dolor Practitioner",
    issuer: "Sit Amet Guild",
    date: "2023-11",
    verificationUrl: "https://example.com/verify/dolor-practitioner",
    imageSrc: null,
    skillIds: ["skill-dolor"],
  },
];
