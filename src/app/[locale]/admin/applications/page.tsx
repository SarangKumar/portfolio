import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AdminApplicationsPage } from "@/features/admin/applications/admin-applications-page";
import { activateLocale, resolvePageLocale } from "@/lib/locale-page";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: resolvePageLocale(locale),
    namespace: "admin.applications",
  });

  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  return <AdminApplicationsPage searchParams={await searchParams} />;
}
