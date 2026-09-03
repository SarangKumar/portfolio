import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { LoginView } from "@/features/auth/login-view";
import { getCurrentUser } from "@/auth/session";
import {
  activateLocale,
  resolvePageLocale,
  type LocalePageProps,
} from "@/lib/locale-page";
import { safeInternalPath } from "@/auth/redirect";

export const dynamic = "force-dynamic";

type LoginPageProps = LocalePageProps & {
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
}: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: resolvePageLocale(locale),
    namespace: "auth",
  });

  return {
    title: t("login.metadata.title"),
    description: t("login.metadata.description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  const query = await searchParams;
  const callbackUrl = safeInternalPath(readCallbackUrl(query.callbackUrl));
  const user = await getCurrentUser();

  if (user) {
    redirect(callbackUrl);
  }

  return <LoginView callbackUrl={callbackUrl} />;
}
