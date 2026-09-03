import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { resolveCurrentAdminAccess } from "@/admin/access";
import { adminLayoutView } from "@/admin/layout-view";
import { AdminShell } from "@/features/admin/admin-shell";
import { getAdminShellCopy } from "@/features/admin/shell-copy";
import { AccessDenied } from "@/features/auth/access-denied";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { activateLocale, resolvePageLocale } from "@/lib/locale-page";

export const dynamic = "force-dynamic";

type AdminLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Pick<AdminLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: resolvePageLocale(locale),
    namespace: "admin",
  });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale } = await params;
  await activateLocale(locale);

  const access = await resolveCurrentAdminAccess();
  const view = adminLayoutView(access);

  if (view === "login") {
    redirect("/login");
  }

  if (view === "denied") {
    return (
      <div className="min-h-dvh bg-background">
        <SkipToContent />
        <main id="content" tabIndex={-1} className="app-container py-6">
          <AccessDenied />
        </main>
      </div>
    );
  }

  if (access.status !== "allowed") {
    redirect("/login");
  }

  const copy = await getAdminShellCopy();

  return (
    <AdminShell email={access.admin.email} copy={copy}>
      {children}
    </AdminShell>
  );
}
