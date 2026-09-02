import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export type LocalePageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ role?: string }>;
};

export type MetadataNamespace =
  "home" | "about" | "experience" | "skills" | "projects";

export function resolvePageLocale(locale: string) {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

export async function activateLocale(locale: string) {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return locale;
}

export async function pageMetadata(
  locale: string,
  namespace: MetadataNamespace,
): Promise<Metadata> {
  const resolvedLocale = resolvePageLocale(locale);
  const t = await getTranslations({ locale: resolvedLocale, namespace });

  if (namespace === "home") {
    const tCommon = await getTranslations({
      locale: resolvedLocale,
      namespace: "common",
    });

    return {
      title: {
        absolute: `${t("metadata.title")} · ${tCommon("metadata.title")}`,
      },
      description: t("metadata.description"),
    };
  }

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}
