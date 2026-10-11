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
  email: "sarangkumar1578@gmail.com",
  socialLinks: [
    {
      id: "social-linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sarangkumar4",
    },
    {
      id: "social-github",
      label: "GitHub",
      href: "https://github.com/SarangKumar",
    },
    {
      id: "social-phone",
      label: "+91 9973694884",
      href: "tel:+919973694884",
    },
  ],
};
