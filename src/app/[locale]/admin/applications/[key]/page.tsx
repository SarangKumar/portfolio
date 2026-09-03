import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { AdminApplicationDetailPage } from "@/features/admin/applications/admin-application-detail-page";
import { activateLocale, resolvePageLocale } from "@/lib/locale-page";

export const dynamic = "force-dynamic";

type ApplicationDetailPageProps = {
  params: Promise<{ locale: string; key: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: ApplicationDetailPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: resolvePageLocale(locale),
    namespace: "admin.applications.detail",
  });

  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  params,
  searchParams,
}: ApplicationDetailPageProps) {
  const { locale, key } = await params;
  await activateLocale(locale);

  if (!key) {
    notFound();
  }

  return (
    <AdminApplicationDetailPage
      applicationKey={key}
      searchParams={await searchParams}
    />
  );
}
