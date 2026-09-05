import { AdminMobileNav } from "@/features/admin/admin-mobile-nav";
import type { AdminNavCopy } from "@/features/admin/admin-nav";
import { SignOutForm } from "@/features/auth/sign-out-form";

type AdminHeaderProps = {
  title: string;
  email: string;
  sessionLabel: string;
  logoutLabel: string;
  navLabels: AdminNavCopy;
  pathname: string;
  openMenuLabel: string;
  closeMenuLabel: string;
  navLabel: string;
};

export function AdminHeader({
  title,
  email,
  sessionLabel,
  logoutLabel,
  navLabels,
  pathname,
  openMenuLabel,
  closeMenuLabel,
  navLabel,
}: AdminHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-3">
      <div className="flex min-w-0 items-center gap-2">
        <AdminMobileNav
          labels={navLabels}
          pathname={pathname}
          openLabel={openMenuLabel}
          closeLabel={closeMenuLabel}
          navLabel={navLabel}
        />
        <p className="truncate type-small font-semibold tracking-tight">
          {title}
        </p>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <p
          className="min-w-0 max-w-28 truncate type-metadata sm:max-w-48"
          title={email}
        >
          <span className="sr-only">{sessionLabel}: </span>
          {email}
        </p>
        <SignOutForm label={logoutLabel} />
      </div>
    </header>
  );
}
