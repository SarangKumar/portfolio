import { AboutPage } from "@/features/about/about-page";
import {
  activateLocale,
  pageMetadata,
  type LocalePageProps,
} from "@/lib/locale-page";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return pageMetadata(locale, "about");
}

export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  return <AboutPage />;
}
