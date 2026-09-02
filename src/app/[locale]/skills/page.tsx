import { SkillsPage } from "@/features/skills/skills-page";
import {
  activateLocale,
  pageMetadata,
  type LocalePageProps,
} from "@/lib/locale-page";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return pageMetadata(locale, "skills");
}

export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  return <SkillsPage />;
}
