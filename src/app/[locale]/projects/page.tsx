import { ProjectsPage } from "@/features/projects/projects-page";
import {
  activateLocale,
  publicPageMetadata,
  type LocalePageProps,
} from "@/lib/locale-page";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return publicPageMetadata(locale, "projects");
}

export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  return <ProjectsPage />;
}
