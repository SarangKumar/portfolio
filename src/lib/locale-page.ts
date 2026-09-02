import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { metadataTitle, shareMetadata } from "@/lib/seo";

export type LocalePageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ role?: string }>;
};

export type MetadataNamespace =
  | "home"
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "resume"
  | "blog"
  | "contact";

const pagePaths: Record<MetadataNamespace, string> = {
  home: "/",
  about: "/about",
  experience: "/experience",
  skills: "/skills",
  projects: "/projects",
  resume: "/resume",
  blog: "/blog",
  contact: "/contact",
};

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

export async function publicPageMetadata(
  locale: string,
  namespace: MetadataNamespace,
  path: string = pagePaths[namespace],
): Promise<Metadata> {
  const metadata = await pageMetadata(locale, namespace);
  const title = metadataTitle(metadata, namespace);
  const description = metadata.description ?? "";

  return {
    ...metadata,
    ...shareMetadata({
      title,
      description,
      path,
    }),
  };
}
