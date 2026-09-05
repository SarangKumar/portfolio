"use client";

import type { ComponentType, SVGProps } from "react";
import {
  BarChart3,
  Briefcase,
  Building2,
  CalendarClock,
  FileText,
  Layers,
  LayoutDashboard,
  Mail,
  NotebookPen,
  Search,
  Settings,
} from "lucide-react";
import NextLink from "next/link";
import {
  isAdminNavItemActive,
  type AdminNavItem,
} from "@/config/admin-navigation";
import { cn } from "@/lib/cn";

const navIcons = {
  dashboard: LayoutDashboard,
  projects: Layers,
  applications: Briefcase,
  jobs: Search,
  interviews: CalendarClock,
  companies: Building2,
  resumes: FileText,
  letters: Mail,
  notes: NotebookPen,
  analytics: BarChart3,
  settings: Settings,
} satisfies Record<
  AdminNavItem["labelKey"],
  ComponentType<SVGProps<SVGSVGElement>>
>;

export type AdminNavCopy = Record<AdminNavItem["labelKey"], string>;

type AdminNavProps = {
  items: readonly AdminNavItem[];
  labels: AdminNavCopy;
  pathname: string;
  id?: string;
  onNavigate?: () => void;
};

export function AdminNav({
  items,
  labels,
  pathname,
  id,
  onNavigate,
}: AdminNavProps) {
  return (
    <ul id={id} className="stack-compact p-2">
      {items.map((item) => {
        const Icon = navIcons[item.labelKey];
        const active = isAdminNavItemActive(pathname, item.href);

        return (
          <li key={item.href}>
            <NextLink
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 type-small font-medium",
                "text-muted-foreground hover:bg-muted hover:text-foreground",
                "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
                active &&
                  "border-l-2 border-primary bg-muted text-foreground hover:text-foreground",
                !active && "border-l-2 border-transparent",
              )}
            >
              <Icon aria-hidden="true" className="size-3.5 shrink-0" />
              {labels[item.labelKey]}
            </NextLink>
          </li>
        );
      })}
    </ul>
  );
}
