import { HomePage } from "@/features/home/home-page";
import {
  activateLocale,
  publicPageMetadata,
  type LocalePageProps,
} from "@/lib/locale-page";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return publicPageMetadata(locale, "home");
}

export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  return <HomePage />;
}
