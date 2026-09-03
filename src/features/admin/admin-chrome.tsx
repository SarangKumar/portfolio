"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminHeader } from "@/features/admin/admin-header";
import { AdminSidebar } from "@/features/admin/admin-sidebar";
import type { AdminShellCopy } from "@/features/admin/shell-copy";

type AdminChromeProps = {
  email: string;
  copy: AdminShellCopy;
  children: ReactNode;
};

export function AdminChrome({ email, copy, children }: AdminChromeProps) {
  const pathname = usePathname() || "/admin";

  return (
    <>
      <AdminSidebar
        appName={copy.appName}
        navLabel={copy.sidebarLabel}
        labels={copy.navLabels}
        pathname={pathname}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          title={copy.appName}
          email={email}
          sessionLabel={copy.sessionLabel}
          logoutLabel={copy.logoutLabel}
          navLabels={copy.navLabels}
          pathname={pathname}
          openMenuLabel={copy.openMenuLabel}
          closeMenuLabel={copy.closeMenuLabel}
          navLabel={copy.navLabel}
        />
        <main
          id="content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto outline-none"
        >
          <div className="stack-section p-4">{children}</div>
        </main>
      </div>
    </>
  );
}
