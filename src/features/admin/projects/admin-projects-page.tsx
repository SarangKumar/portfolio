import { getTranslations } from "next-intl/server";
import { readAuthorizedAdminContext } from "@/admin/actions";
import { getCurrentAdmin } from "@/admin/access";
import { getProjectService } from "@/cms/projects/runtime";
import { DatabaseHealthNotice } from "@/features/admin/database-health";
import { AdminSectionPlaceholder } from "@/features/admin/admin-section-placeholder";
import { AccessDenied } from "@/features/auth/access-denied";
import {
  CreateProjectLink,
  ProjectList,
  ProjectUnavailableNotice,
} from "@/features/admin/projects/project-list";

export async function AdminProjectsPage() {
  const operation = await readAuthorizedAdminContext();
  const admin = await getCurrentAdmin();

  if (!operation.ok || !admin) {
    return <AccessDenied />;
  }

  const t = await getTranslations("admin");
  const listed = await getProjectService().list();

  return (
    <div className="stack-section">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <AdminSectionPlaceholder
          title={t("cms.projects.title")}
          description={t("cms.projects.intro")}
        />
        <CreateProjectLink
          href="/admin/projects/new"
          label={t("cms.projects.create")}
        />
      </div>
      <DatabaseHealthNotice />
      {listed.ok ? (
        <ProjectList
          projects={listed.value}
          copy={{
            empty: t("cms.projects.empty"),
            edit: t("cms.projects.edit"),
            status: {
              draft: t("cms.status.draft"),
              published: t("cms.status.published"),
              archived: t("cms.status.archived"),
            },
          }}
        />
      ) : (
        <ProjectUnavailableNotice message={t("cms.unavailable")} />
      )}
    </div>
  );
}
