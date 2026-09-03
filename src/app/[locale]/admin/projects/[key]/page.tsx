import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { AdminProjectEditPage } from "@/features/admin/projects/admin-project-editor";
import { activateLocale, resolvePageLocale } from "@/lib/locale-page";

export const dynamic = "force-dynamic";

type ProjectEditPageProps = {
  params: Promise<{ locale: string; key: string }>;
};

export async function generateMetadata({
  params,
}: ProjectEditPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: resolvePageLocale(locale),
    namespace: "admin",
  });

  return {
    title: t("cms.projects.editTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: ProjectEditPageProps) {
  const { locale, key } = await params;
  await activateLocale(locale);

  if (!key) {
    notFound();
  }

  return <AdminProjectEditPage projectKey={key} />;
}
