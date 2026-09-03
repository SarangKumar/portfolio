/**
 * Sample contact details. example.com is reserved placeholder space.
 */
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
  email: "lorem@example.com",
  socialLinks: [
    {
      id: "social-lorem",
      label: "Lorem profile",
      href: "https://example.com/lorem",
    },
    {
      id: "social-ipsum",
      label: "Ipsum notes",
      href: "https://example.com/ipsum",
    },
  ],
};
