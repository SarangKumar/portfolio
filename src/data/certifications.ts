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

export const certifications: readonly Certification[] = [];
