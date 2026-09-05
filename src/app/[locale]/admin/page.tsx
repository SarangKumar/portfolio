import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { readAuthorizedAdminContext } from "@/admin/actions";
import { getCurrentAdmin } from "@/admin/access";
import { AdminSectionPlaceholder } from "@/features/admin/admin-section-placeholder";
import { DatabaseHealthNotice } from "@/features/admin/database-health";
import { AccessDenied } from "@/features/auth/access-denied";
import {
  activateLocale,
  resolvePageLocale,
  type LocalePageProps,
} from "@/lib/locale-page";

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
    title: t("dashboard.title"),
    description: t("dashboard.intro"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminDashboardPage({ params }: LocalePageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  const operation = await readAuthorizedAdminContext();
  const admin = await getCurrentAdmin();

  if (!operation.ok || !admin) {
    return <AccessDenied />;
  }

  const t = await getTranslations("admin");

  return (
    <div className="stack-section">
      <AdminSectionPlaceholder
        title={t("dashboard.title")}
        description={t("dashboard.intro")}
      />
      <DatabaseHealthNotice />
    </div>
  );
}
