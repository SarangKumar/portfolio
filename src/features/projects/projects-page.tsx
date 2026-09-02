import { getTranslations } from "next-intl/server";
import { ContentPlaceholder } from "@/components/content/content-placeholder";
import { PageHeader } from "@/components/content/page-header";
import { ProjectGrid } from "@/components/content/project-grid";
import { projects } from "@/data/projects";

export async function ProjectsPage() {
  const t = await getTranslations("projects");

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
