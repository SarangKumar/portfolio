import { getTranslations } from "next-intl/server";
import { AdminPlaceholder } from "@/features/auth/admin-placeholder";
import { requireAuthentication } from "@/auth/session";
import { activateLocale, type LocalePageProps } from "@/lib/locale-page";

export const dynamic = "force-dynamic";

export default async function AdminPage({ params }: LocalePageProps) {
  const { locale } = await params;
  await activateLocale(locale);
  const user = await requireAuthentication();
  const t = await getTranslations("auth");

  return (
    <AdminPlaceholder
      copy={{
        title: t("admin.title"),
        intro: t("admin.intro"),
        signedInAs: t("admin.signedInAs", { email: user.email }),
        logout: t("logout.action"),
      }}
    />
  );
}
