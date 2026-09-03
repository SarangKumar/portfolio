import { getTranslations } from "next-intl/server";
import { readAuthorizedAdminContext } from "@/admin/actions";
import { getCurrentAdmin } from "@/admin/access";
import { AccessDenied } from "@/features/auth/access-denied";
import { AdminPlaceholder } from "@/features/auth/admin-placeholder";
import { activateLocale, type LocalePageProps } from "@/lib/locale-page";

export const dynamic = "force-dynamic";

export default async function AdminPage({ params }: LocalePageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  const operation = await readAuthorizedAdminContext();
  const admin = await getCurrentAdmin();

  if (!operation.ok || !admin) {
    return <AccessDenied />;
  }

  const t = await getTranslations("auth");

  return (
    <AdminPlaceholder
      copy={{
        title: t("admin.title"),
        intro: t("admin.intro"),
        signedInAs: t("admin.signedInAs", { email: admin.email }),
        logout: t("logout.action"),
      }}
    />
  );
}
