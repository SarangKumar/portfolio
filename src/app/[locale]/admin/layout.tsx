import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { requireAuthentication } from "@/auth/session";
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
    namespace: "auth",
  });

  return {
    title: t("admin.metadata.title"),
    description: t("admin.metadata.description"),
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
  await requireAuthentication();

  return children;
}
