import { getTranslations } from "next-intl/server";
import { adminNavItems } from "@/config/admin-navigation";
import type { AdminNavCopy } from "@/features/admin/admin-nav";

export type AdminShellCopy = {
  appName: string;
  sessionLabel: string;
  logoutLabel: string;
  navLabel: string;
  sidebarLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
  navLabels: AdminNavCopy;
};

export async function getAdminShellCopy(): Promise<AdminShellCopy> {
  const t = await getTranslations("admin");
  const navLabels = Object.fromEntries(
    adminNavItems.map((item) => [item.labelKey, t(`nav.${item.labelKey}`)]),
  ) as AdminNavCopy;

  return {
    appName: t("appName"),
    sessionLabel: t("session"),
    logoutLabel: t("logout"),
    navLabel: t("navigation"),
    sidebarLabel: t("sidebar"),
    openMenuLabel: t("openMenu"),
    closeMenuLabel: t("closeMenu"),
    navLabels,
  };
}
