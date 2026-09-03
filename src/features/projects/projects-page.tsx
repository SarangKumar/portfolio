import { getTranslations } from "next-intl/server";
import { getPublishedProjects } from "@/content/public";
import { ContentPlaceholder } from "@/components/content/content-placeholder";
import { PageHeader } from "@/components/content/page-header";
import { ProjectGrid } from "@/components/content/project-grid";

export async function ProjectsPage() {
  const t = await getTranslations("projects");
  const projects = await getPublishedProjects();

  return (
    <div className="stack-section">
      <PageHeader title={t("title")} description={t("intro")} />
      <ProjectGrid
        projects={projects}
        tagsLabel={t("technologies")}
        empty={<ContentPlaceholder>{t("placeholder")}</ContentPlaceholder>}
      />
    </div>
  );
}
