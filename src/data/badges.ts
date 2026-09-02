export type BadgeCredential = {
  id: string;
  name: string;
  issuer: string;
  date: string | null;
  verificationUrl: string | null;
  imageSrc: string | null;
  skillIds: readonly string[];
};

export const badges: readonly BadgeCredential[] = [];
