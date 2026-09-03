export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string | null;
  credentialId: string | null;
  verificationUrl: string | null;
  mediaSrc: string | null;
  skillIds: readonly string[];
};

export const certifications: readonly Certification[] = [
  {
    id: "cert-lorem-professional",
    name: "Lorem Professional",
    issuer: "Ipsum Institute",
    date: "2024-06",
    credentialId: "LOREM-0001",
    verificationUrl: "https://example.com/verify/lorem-professional",
    mediaSrc: null,
    skillIds: ["skill-lorem", "skill-consectetur"],
  },
];
