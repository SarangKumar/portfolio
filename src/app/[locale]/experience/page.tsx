import { ExperiencePage } from "@/features/experience/experience-page";
import {
  activateLocale,
  pageMetadata,
  type LocalePageProps,
} from "@/lib/locale-page";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return pageMetadata(locale, "experience");
}

export default async function Page({ params, searchParams }: LocalePageProps) {
  const { locale } = await params;
  const query = (await searchParams) ?? {};
  await activateLocale(locale);

  return <ExperiencePage selectedId={query.role} />;
}
