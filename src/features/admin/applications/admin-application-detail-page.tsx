import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { readAuthorizedAdminContext } from "@/admin/actions";
import { resolveCurrentAdminAccess } from "@/admin/access";
import {
  getJobApplication,
  listJobApplicationStatusHistory,
} from "@/career/applications/access";
import {
  parseApplicationDetailSearchParams,
  type ApplicationSearchParams,
} from "@/career/applications/query";
import { getJobApplicationService } from "@/career/applications/runtime";
import {
  jobApplicationPriorities,
  jobApplicationStatuses,
  workModes,
} from "@/career/applications/status";
import { AccessDenied } from "@/features/auth/access-denied";
import { ApplicationDetail } from "@/features/admin/applications/application-detail";
import { resolveApplicationDetailView } from "@/features/admin/applications/application-detail-view";
import type { ApplicationDetailCopy } from "@/features/admin/applications/application-detail-copy";

type AdminApplicationDetailPageProps = {
  applicationKey: string;
  searchParams: ApplicationSearchParams;
};

export async function AdminApplicationDetailPage({
  applicationKey,
  searchParams,
}: AdminApplicationDetailPageProps) {
  const operation = await readAuthorizedAdminContext();
  const access = await resolveCurrentAdminAccess();
  const authorized = operation.ok && access.status === "allowed";
  const service = getJobApplicationService();
  const result = authorized
    ? await getJobApplication(access, service, applicationKey)
    : null;
  const view = resolveApplicationDetailView({ authorized, result });

  if (view.kind === "denied") {
    return <AccessDenied />;
  }

  if (view.kind === "notFound") {
    notFound();
  }

  const t = await getTranslations("admin.applications");
  const tDetail = await getTranslations("admin.applications.detail");

  if (view.kind === "unavailable") {
    return (
      <p role="alert" className="type-small text-destructive">
        {tDetail("unavailable")}
      </p>
    );
  }

  if (access.status !== "allowed") {
    return <AccessDenied />;
  }

  const state = parseApplicationDetailSearchParams(searchParams);
  const historyResult = await listJobApplicationStatusHistory(
    access,
    service,
    applicationKey,
  );
  const copy: ApplicationDetailCopy = {
    back: tDetail("back"),
    openJob: tDetail("openJob"),
    edit: tDetail("edit"),
    archived: tDetail("archived"),
    information: tDetail("information"),
    status: t("status"),
    applied: t("applied"),
    source: tDetail("source"),
    jobUrl: tDetail("jobUrl"),
    location: t("location"),
    workMode: tDetail("workMode"),
    salary: tDetail("salary"),
    priority: t("priority"),
    rejectionReason: tDetail("rejectionReason"),
    jobDescription: tDetail("jobDescription"),
    jobDescriptionEmpty: tDetail("jobDescriptionEmpty"),
    recruiter: tDetail("recruiter"),
    recruiterName: tDetail("recruiterName"),
    referral: tDetail("referral"),
    resume: tDetail("resume"),
    resumeEmpty: tDetail("resumeEmpty"),
    coverLetter: tDetail("coverLetter"),
    coverLetterEmpty: tDetail("coverLetterEmpty"),
    notes: tDetail("notes"),
    notesEmpty: tDetail("notesEmpty"),
    nextAction: t("nextAction"),
    nextActionEmpty: tDetail("nextActionEmpty"),
    due: tDetail("due"),
    interviews: tDetail("interviews"),
    interviewsEmpty: tDetail("interviewsEmpty"),
    interviewsHint: tDetail("interviewsHint"),
    unscheduled: tDetail("unscheduled"),
    statusHistory: tDetail("statusHistory"),
    statusHistoryHint: tDetail("statusHistoryHint"),
    historyEmpty: tDetail("historyEmpty"),
    historyUnavailable: tDetail("historyUnavailable"),
    statusCurrent: tDetail("statusCurrent"),
    initialStatus: tDetail("initialStatus"),
    changedBy: tDetail("changedBy"),
    reason: tDetail("reason"),
    note: tDetail("note"),
    rejectionReasonHint: tDetail("rejectionReasonHint"),
    saveStatus: tDetail("saveStatus"),
    updated: tDetail("updated"),
    created: tDetail("created"),
    refKey: tDetail("refKey"),
    saved: tDetail("saved"),
    emDash: t("emDash"),
    archive: t("archive"),
    archiveConfirm: t("archiveConfirm"),
    archiveHint: t("archiveHint"),
    cancel: t("cancel"),
    changeStatus: t("changeStatus"),
    statusLabel: Object.fromEntries(
      jobApplicationStatuses.map((status) => [
        status,
        t(`statusLabel.${status}`),
      ]),
    ) as ApplicationDetailCopy["statusLabel"],
    priorityLabel: Object.fromEntries(
      jobApplicationPriorities.map((priority) => [
        priority,
        t(`priorityLabel.${priority}`),
      ]),
    ) as ApplicationDetailCopy["priorityLabel"],
    workModeLabel: Object.fromEntries(
      workModes.map((mode) => [mode, tDetail(`workModeLabel.${mode}`)]),
    ) as ApplicationDetailCopy["workModeLabel"],
  };

  return (
    <ApplicationDetail
      record={view.record}
      from={state.from}
      autoFocusStatus={state.edit}
      saved={state.saved}
      history={historyResult.ok ? historyResult.value : []}
      historyUnavailable={!historyResult.ok}
      viewerIdentityId={access.admin.id}
      viewerEmail={access.admin.email}
      copy={copy}
    />
  );
}
