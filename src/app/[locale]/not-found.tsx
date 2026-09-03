import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/content/page-header";
import { ButtonLink } from "@/components/ui/button-link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("errors");

  return {
    title: t("notFound.title"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="stack-section">
      <PageHeader
        title={t("notFound.title")}
        description={t("notFound.description")}
      />
      <ButtonLink href="/" size="sm" className="w-fit">
        {t("notFound.action")}
      </ButtonLink>
    </div>
  );
}
