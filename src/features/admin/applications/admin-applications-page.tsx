import { getTranslations } from "next-intl/server";
import { readAuthorizedAdminContext } from "@/admin/actions";
import { resolveCurrentAdminAccess } from "@/admin/access";
import { listJobApplications } from "@/career/applications/access";
import {
  APPLICATION_CREATE_PATH,
  applicationTrackerHref,
  applicationTrackerToListQuery,
  parseApplicationTrackerSearchParams,
  type ApplicationSearchParams,
} from "@/career/applications/query";
import { getJobApplicationService } from "@/career/applications/runtime";
import {
  jobApplicationPriorities,
  jobApplicationStatuses,
} from "@/career/applications/status";
import { AccessDenied } from "@/features/auth/access-denied";
import { AdminSectionPlaceholder } from "@/features/admin/admin-section-placeholder";
import { ApplicationFilters } from "@/features/admin/applications/application-filters";
import { CreateApplicationLink } from "@/features/admin/applications/application-links";
import { ApplicationPagination } from "@/features/admin/applications/application-pagination";
import { ApplicationTable } from "@/features/admin/applications/application-table";
import type { ApplicationTrackerCopy } from "@/features/admin/applications/application-tracker-copy";

type AdminApplicationsPageProps = {
  searchParams: ApplicationSearchParams;
};

export async function AdminApplicationsPage({
  searchParams,
}: AdminApplicationsPageProps) {
  const operation = await readAuthorizedAdminContext();
  const access = await resolveCurrentAdminAccess();

  if (!operation.ok || access.status !== "allowed") {
    return <AccessDenied />;
  }

  const t = await getTranslations("admin.applications");
  const state = parseApplicationTrackerSearchParams(searchParams);
  const listed = await listJobApplications(
    access,
    getJobApplicationService(),
    applicationTrackerToListQuery(state),
  );

  const copy: ApplicationTrackerCopy = {
    empty: t("empty"),
    emptyFiltered: t("emptyFiltered"),
    search: t("search"),
    searchPlaceholder: t("searchPlaceholder"),
    status: t("status"),
    company: t("company"),
    role: t("role"),
    location: t("location"),
    applied: t("applied"),
    priority: t("priority"),
    nextAction: t("nextAction"),
    nextActionDate: t("nextActionDate"),
    actions: t("actions"),
    anyStatus: t("anyStatus"),
    anyPriority: t("anyPriority"),
    appliedFrom: t("appliedFrom"),
    appliedTo: t("appliedTo"),
    applyFilters: t("applyFilters"),
    clearFilters: t("clearFilters"),
    open: t("open"),
    edit: t("edit"),
    archive: t("archive"),
    archiveConfirm: t("archiveConfirm"),
    archiveHint: t("archiveHint"),
    cancel: t("cancel"),
    changeStatus: t("changeStatus"),
    sortBy: (column) => t("sortBy", { column }),
    sortedAsc: t("sortedAsc"),
    sortedDesc: t("sortedDesc"),
    page: ({ page, pages }) => t("page", { page, pages }),
    previous: t("previous"),
    next: t("next"),
    results: ({ shown, total }) => t("results", { shown, total }),
    emDash: t("emDash"),
    statusLabel: Object.fromEntries(
      jobApplicationStatuses.map((status) => [
        status,
        t(`statusLabel.${status}`),
      ]),
    ) as ApplicationTrackerCopy["statusLabel"],
    priorityLabel: Object.fromEntries(
      jobApplicationPriorities.map((priority) => [
        priority,
        t(`priorityLabel.${priority}`),
      ]),
    ) as ApplicationTrackerCopy["priorityLabel"],
  };

  return (
    <div className="stack-section">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <AdminSectionPlaceholder title={t("title")} description={t("intro")} />
        <CreateApplicationLink
          href={APPLICATION_CREATE_PATH}
          label={t("form.create")}
        />
      </div>
      <ApplicationFilters state={state} copy={copy} />
      {listed.ok ? (
        <>
          <ApplicationTable
            items={listed.value.items}
            state={state}
            returnTo={applicationTrackerHref(state)}
            copy={copy}
          />
          {listed.value.total > 0 ? (
            <ApplicationPagination
              state={state}
              page={listed.value}
              copy={copy}
            />
          ) : null}
        </>
      ) : (
        <p role="alert" className="type-small text-destructive">
          {t("unavailable")}
        </p>
      )}
    </div>
  );
}
