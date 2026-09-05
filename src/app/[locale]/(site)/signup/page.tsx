import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth/session";
import { SignupView } from "@/features/auth/signup-view";
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
    namespace: "auth",
  });

  return {
    title: t("signup.metadata.title"),
    description: t("signup.metadata.description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SignupPage({ params }: LocalePageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  const user = await getCurrentUser();

  if (user) {
    redirect("/admin");
  }

  return <SignupView />;
}
