export const navItems = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/experience", labelKey: "experience" },
  { href: "/skills", labelKey: "skills" },
  { href: "/projects", labelKey: "projects" },
  { href: "/resume", labelKey: "resume" },
  { href: "/blog", labelKey: "blog" },
  { href: "/contact", labelKey: "contact" },
] as const;

export type NavItem = (typeof navItems)[number];

export function isNavItemActive(
  pathname: string,
  href: NavItem["href"],
): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
