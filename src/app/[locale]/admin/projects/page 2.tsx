import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AdminProjectsPage } from "@/features/admin/projects/admin-projects-page";
import { activateLocale, resolvePageLocale } from "@/lib/locale-page";
import type { LocalePageProps } from "@/lib/locale-page";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: resolvePageLocale(locale),
    namespace: "admin",
  });

  return {
    title: t("cms.projects.title"),
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  return <AdminProjectsPage />;
}
