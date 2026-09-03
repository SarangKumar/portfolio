import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { AdminApplicationEditPage } from "@/features/admin/applications/admin-application-editor";
import { activateLocale, resolvePageLocale } from "@/lib/locale-page";

export const dynamic = "force-dynamic";

type ApplicationEditPageProps = {
  params: Promise<{ locale: string; key: string }>;
};

export async function generateMetadata({
  params,
}: ApplicationEditPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: resolvePageLocale(locale),
    namespace: "admin.applications.form",
  });

  return {
    title: t("editTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: ApplicationEditPageProps) {
  const { locale, key } = await params;
  await activateLocale(locale);

  if (!key) {
    notFound();
  }

  return <AdminApplicationEditPage applicationKey={key} />;
}
