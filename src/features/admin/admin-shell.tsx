import type { ReactNode } from "react";
import { AdminChrome } from "@/features/admin/admin-chrome";
import type { AdminShellCopy } from "@/features/admin/shell-copy";
import { SkipToContent } from "@/components/layout/skip-to-content";

type AdminShellProps = {
  email: string;
  copy: AdminShellCopy;
  children: ReactNode;
};

export function AdminShell({ email, copy, children }: AdminShellProps) {
  return (
    <div className="flex min-h-dvh bg-background">
      <SkipToContent />
      <AdminChrome email={email} copy={copy}>
        {children}
      </AdminChrome>
    </div>
  );
}
