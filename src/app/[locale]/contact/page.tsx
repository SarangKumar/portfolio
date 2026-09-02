import { ContactPage } from "@/features/contact/contact-page";
import {
  activateLocale,
  publicPageMetadata,
  type LocalePageProps,
} from "@/lib/locale-page";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return publicPageMetadata(locale, "contact", "/contact");
}

export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  return <ContactPage />;
}
