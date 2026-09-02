import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { fontMono, fontSans } from "@/lib/fonts";
import { metadataBaseUrl, personJsonLd, websiteJsonLd } from "@/lib/seo";
import "../globals.css";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  const t = await getTranslations({
    locale: resolvedLocale,
    namespace: "common",
  });

  const title = t("metadata.title");
  const description = t("metadata.description");

  return {
    metadataBase: metadataBaseUrl(),
    title: {
      default: title,
      template: `%s · ${title}`,
    },
    description,
    applicationName: t("appName"),
    openGraph: {
      type: "website",
      locale: siteConfig.openGraphLocale,
      siteName: title,
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html
      lang={locale}
      className={cn("dark", fontSans.variable, fontMono.variable)}
    >
      <body className="min-h-dvh bg-background font-sans text-body text-foreground antialiased">
        <JsonLd data={websiteJsonLd(t("metadata.description"))} />
        <JsonLd data={personJsonLd()} />
        <NextIntlClientProvider>
          <SiteShell>{children}</SiteShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
