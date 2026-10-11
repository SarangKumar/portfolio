import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { safeInternalPath } from "@/auth/redirect";
import { UnlockView } from "@/features/auth/unlock-view";
import {
  activateLocale,
  resolvePageLocale,
  type LocalePageProps,
} from "@/lib/locale-page";

export const dynamic = "force-dynamic";

type UnlockPageProps = LocalePageProps & {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
};

function readCallbackUrl(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export async function generateMetadata({
  params,
}: UnlockPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: resolvePageLocale(locale),
    namespace: "auth",
  });

  return {
    title: t("unlock.metadata.title"),
    description: t("unlock.metadata.description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function UnlockPage({
  params,
  searchParams,
}: UnlockPageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  const query = await searchParams;
  const callbackUrl = safeInternalPath(readCallbackUrl(query.callbackUrl));

  return <UnlockView callbackUrl={callbackUrl} />;
}
