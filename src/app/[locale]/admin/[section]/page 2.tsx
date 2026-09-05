import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { readAuthorizedAdminContext } from "@/admin/actions";
import { getCurrentAdmin } from "@/admin/access";
import { adminNavItems } from "@/config/admin-navigation";
import { AdminSectionPlaceholder } from "@/features/admin/admin-section-placeholder";
import { AccessDenied } from "@/features/auth/access-denied";
import { activateLocale, resolvePageLocale } from "@/lib/locale-page";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

const dedicatedAdminSections = new Set(["projects", "applications"]);

const sectionItems = adminNavItems.filter(
  (item) =>
    item.href !== "/admin" &&
    !dedicatedAdminSections.has(item.href.slice("/admin/".length)),
);

type AdminSectionPageProps = {
  params: Promise<{ locale: string; section: string }>;
};

function navItemForSection(section: string) {
  return sectionItems.find((item) => item.href === `/admin/${section}`);
}

export function generateStaticParams() {
  return sectionItems.map((item) => ({
    section: item.href.slice("/admin/".length),
  }));
}

export async function generateMetadata({
  params,
}: AdminSectionPageProps): Promise<Metadata> {
  const { locale, section } = await params;
  const item = navItemForSection(section);
  const t = await getTranslations({
    locale: resolvePageLocale(locale),
    namespace: "admin",
  });

  if (!item) {
    return {
      title: t("metadata.title"),
      robots: { index: false, follow: false },
    };
  }

  return {
    title: t(`nav.${item.labelKey}`),
    description: t("section.unavailable"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminSectionPage({
  params,
}: AdminSectionPageProps) {
  const { locale, section } = await params;
  await activateLocale(locale);

  const item = navItemForSection(section);

  if (!item) {
    notFound();
  }

  const operation = await readAuthorizedAdminContext();
  const admin = await getCurrentAdmin();

  if (!operation.ok || !admin) {
    return <AccessDenied />;
  }

  const t = await getTranslations("admin");

  return (
    <AdminSectionPlaceholder
      title={t(`nav.${item.labelKey}`)}
      description={t("section.unavailable")}
    />
  );
}
