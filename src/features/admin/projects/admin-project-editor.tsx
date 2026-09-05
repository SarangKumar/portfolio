import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { readAuthorizedAdminContext } from "@/admin/actions";
import { getCurrentAdmin } from "@/admin/access";
import { getProjectService } from "@/cms/projects/runtime";
import { DatabaseHealthNotice } from "@/features/admin/database-health";
import { AdminSectionPlaceholder } from "@/features/admin/admin-section-placeholder";
import { AccessDenied } from "@/features/auth/access-denied";
import { ProjectForm } from "@/features/admin/projects/project-form";
import { ProjectStatusControls } from "@/features/admin/projects/project-status-controls";
import { PublicationStatusBadge } from "@/features/admin/publication-status-badge";
import type { ProjectFormCopy } from "@/features/admin/projects/project-form";

async function projectFormCopy(): Promise<ProjectFormCopy> {
  const t = await getTranslations("admin");

  return {
    title: t("cms.projects.fields.title"),
    slug: t("cms.projects.fields.slug"),
    slugHint: t("cms.projects.fields.slugHint"),
    summary: t("cms.projects.fields.summary"),
    description: t("cms.projects.fields.description"),
    technologies: t("cms.projects.fields.technologies"),
    technologiesHint: t("cms.projects.fields.technologiesHint"),
    skillKeys: t("cms.projects.fields.skillKeys"),
    skillKeysHint: t("cms.projects.fields.skillKeysHint"),
    githubUrl: t("cms.projects.fields.githubUrl"),
    demoUrl: t("cms.projects.fields.demoUrl"),
    internalNotes: t("cms.projects.fields.internalNotes"),
    internalNotesHint: t("cms.projects.fields.internalNotesHint"),
    save: t("cms.projects.save"),
    saving: t("cms.projects.saving"),
    saved: t("cms.projects.saved"),
    required: t("cms.errors.required"),
    tooLong: t("cms.errors.tooLong"),
    tooMany: t("cms.errors.tooMany"),
    invalidSlug: t("cms.errors.invalidSlug"),
    invalidUrl: t("cms.errors.invalidUrl"),
    duplicateSlug: t("cms.errors.duplicateSlug"),
    unauthorized: t("cms.errors.unauthorized"),
    unavailable: t("cms.unavailable"),
    notFound: t("cms.errors.notFound"),
  };
}

export async function AdminProjectCreatePage() {
  const operation = await readAuthorizedAdminContext();
  const admin = await getCurrentAdmin();

  if (!operation.ok || !admin) {
    return <AccessDenied />;
  }

  const t = await getTranslations("admin");

  return (
    <div className="stack-section">
      <AdminSectionPlaceholder
        title={t("cms.projects.createTitle")}
        description={t("cms.projects.createIntro")}
      />
      <NextLink
        href="/admin/projects"
        className="type-small text-muted-foreground hover:text-foreground"
      >
        {t("cms.projects.back")}
      </NextLink>
      <DatabaseHealthNotice />
      <ProjectForm mode="create" copy={await projectFormCopy()} />
    </div>
  );
}

export async function AdminProjectEditPage({
  projectKey,
}: {
  projectKey: string;
}) {
  const operation = await readAuthorizedAdminContext();
  const admin = await getCurrentAdmin();

  if (!operation.ok || !admin) {
    return <AccessDenied />;
  }

  const result = await getProjectService().get(projectKey);

  if (!result.ok) {
    if (result.code === "notFound") {
      notFound();
    }

    const t = await getTranslations("admin");
    return (
      <p role="alert" className="type-small text-destructive">
        {t("cms.unavailable")}
      </p>
    );
  }

  const t = await getTranslations("admin");
  const project = result.value;

  return (
    <div className="stack-section">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <AdminSectionPlaceholder
          title={project.title}
          description={t("cms.projects.editIntro")}
        />
        <PublicationStatusBadge
          status={project.status}
          labels={{
            draft: t("cms.status.draft"),
            published: t("cms.status.published"),
            archived: t("cms.status.archived"),
          }}
        />
      </div>
      <NextLink
        href="/admin/projects"
        className="type-small text-muted-foreground hover:text-foreground"
      >
        {t("cms.projects.back")}
      </NextLink>
      <ProjectStatusControls
        projectKey={project.key}
        status={project.status}
        copy={{
          publish: t("cms.projects.publish"),
          unpublish: t("cms.projects.unpublish"),
          archive: t("cms.projects.archive"),
          archiveConfirm: t("cms.projects.archiveConfirm"),
          archiveHint: t("cms.projects.archiveHint"),
          cancel: t("cms.projects.cancel"),
        }}
      />
      <ProjectForm
        mode="edit"
        project={project}
        copy={await projectFormCopy()}
      />
    </div>
  );
}
