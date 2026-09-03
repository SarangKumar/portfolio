import NextLink from "next/link";
import { AdminNav, type AdminNavCopy } from "@/features/admin/admin-nav";
import { adminNavItems, type AdminNavItem } from "@/config/admin-navigation";

type AdminSidebarProps = {
  appName: string;
  navLabel: string;
  labels: AdminNavCopy;
  pathname: string;
  items?: readonly AdminNavItem[];
};

export function AdminSidebar({
  appName,
  navLabel,
  labels,
  pathname,
  items = adminNavItems,
}: AdminSidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <div className="flex h-12 items-center border-b border-border px-3">
        <NextLink
          href="/admin"
          className="truncate type-small font-semibold tracking-tight text-foreground hover:text-foreground"
        >
          {appName}
        </NextLink>
      </div>
      <nav aria-label={navLabel} className="flex-1 overflow-y-auto">
        <AdminNav items={items} labels={labels} pathname={pathname} />
      </nav>
    </aside>
  );
}
