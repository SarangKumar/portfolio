export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export type ContactProfile = {
  email: string | null;
  socialLinks: readonly SocialLink[];
};

export const contactProfile: ContactProfile = {
  email: null,
  socialLinks: [],
};
