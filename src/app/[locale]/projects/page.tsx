import { ProjectsPage } from "@/features/projects/projects-page";
import {
  activateLocale,
  pageMetadata,
  type LocalePageProps,
} from "@/lib/locale-page";
import { absoluteUrl } from "@/lib/url";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const metadata = await pageMetadata(locale, "projects");
  const url = absoluteUrl("/projects");

  return {
    ...metadata,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website" as const,
      title: typeof metadata.title === "string" ? metadata.title : "Projects",
      description: metadata.description,
      url,
    },
  };
}

export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  await activateLocale(locale);

  return <ProjectsPage />;
}
