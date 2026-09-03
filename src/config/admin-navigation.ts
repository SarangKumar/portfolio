export const adminNavItems = [
  { href: "/admin", labelKey: "dashboard" },
  { href: "/admin/applications", labelKey: "applications" },
  { href: "/admin/jobs", labelKey: "jobs" },
  { href: "/admin/interviews", labelKey: "interviews" },
  { href: "/admin/companies", labelKey: "companies" },
  { href: "/admin/resumes", labelKey: "resumes" },
  { href: "/admin/letters", labelKey: "letters" },
  { href: "/admin/notes", labelKey: "notes" },
  { href: "/admin/analytics", labelKey: "analytics" },
  { href: "/admin/settings", labelKey: "settings" },
] as const;

export type AdminNavItem = (typeof adminNavItems)[number];
export type AdminNavHref = AdminNavItem["href"];
export type AdminSectionKey = Exclude<AdminNavItem["labelKey"], "dashboard">;

export const adminSectionHrefs = adminNavItems
  .filter((item) => item.href !== "/admin")
  .map((item) => item.href);

export function isAdminNavItemActive(
  pathname: string,
  href: AdminNavHref,
): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function adminSectionFromPath(pathname: string): AdminNavItem | null {
  return (
    adminNavItems.find((item) => isAdminNavItemActive(pathname, item.href)) ??
    null
  );
}
