import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { readAuthorizedAdminContext } from "@/admin/actions";
import { resolveCurrentAdminAccess } from "@/admin/access";
import { getJobApplication } from "@/career/applications/access";
import {
  APPLICATIONS_PATH,
  applicationDetailPath,
} from "@/career/applications/query";
import { getJobApplicationService } from "@/career/applications/runtime";
import {
  jobApplicationPriorities,
  jobApplicationStatuses,
  workModes,
} from "@/career/applications/status";
import { AccessDenied } from "@/features/auth/access-denied";
import { AdminSectionPlaceholder } from "@/features/admin/admin-section-placeholder";
import { ApplicationForm } from "@/features/admin/applications/application-form";
import type { ApplicationFormCopy } from "@/features/admin/applications/application-form-copy";

async function applicationFormCopy(): Promise<ApplicationFormCopy> {
  const t = await getTranslations("admin.applications");
  const tCms = await getTranslations("admin.cms");

  return {
    save: t("form.save"),
    saving: t("form.saving"),
    saved: t("form.saved"),
    sections: {
      role: t("form.sections.role"),
      compensation: t("form.sections.compensation"),
      description: t("form.sections.description"),
      sourcing: t("form.sections.sourcing"),
      documents: t("form.sections.documents"),
      followUp: t("form.sections.followUp"),
    },
    fields: {
      company: t("company"),
      role: t("role"),
      jobUrl: t("form.fields.jobUrl"),
      location: t("location"),
      workMode: t("form.fields.workMode"),
      jobDescription: t("form.fields.jobDescription"),
      jobDescriptionHint: t("form.fields.jobDescriptionHint"),
      salaryAmount: t("form.fields.salaryAmount"),
      salaryCurrency: t("form.fields.salaryCurrency"),
      salaryCurrencyHint: t("form.fields.salaryCurrencyHint"),
      appliedAt: t("form.fields.appliedAt"),
      status: t("status"),
      source: t("form.fields.source"),
      referral: t("form.fields.referral"),
      recruiter: t("form.fields.recruiter"),
      resumeVersionKey: t("form.fields.resumeVersionKey"),
      resumeVersionKeyHint: t("form.fields.resumeVersionKeyHint"),
      coverLetterKey: t("form.fields.coverLetterKey"),
      coverLetterKeyHint: t("form.fields.coverLetterKeyHint"),
      notes: t("form.fields.notes"),
      priority: t("priority"),
      nextAction: t("nextAction"),
      nextActionAt: t("nextActionDate"),
      rejectionReason: t("form.fields.rejectionReason"),
    },
    errors: {
      required: tCms("errors.required"),
      tooLong: tCms("errors.tooLong"),
      invalidUrl: tCms("errors.invalidUrl"),
      invalidDate: t("form.errors.invalidDate"),
      invalid: t("form.errors.invalid"),
      incomplete: t("form.errors.incomplete"),
      unauthorized: tCms("errors.unauthorized"),
      notFound: tCms("errors.notFound"),
      unavailable: t("unavailable"),
    },
    statusLabel: Object.fromEntries(
      jobApplicationStatuses.map((status) => [
        status,
        t(`statusLabel.${status}`),
      ]),
    ) as ApplicationFormCopy["statusLabel"],
    priorityLabel: Object.fromEntries(
      jobApplicationPriorities.map((priority) => [
        priority,
        t(`priorityLabel.${priority}`),
      ]),
    ) as ApplicationFormCopy["priorityLabel"],
    workModeLabel: Object.fromEntries(
      workModes.map((mode) => [mode, t(`detail.workModeLabel.${mode}`)]),
    ) as ApplicationFormCopy["workModeLabel"],
  };
}

export async function AdminApplicationCreatePage() {
  const operation = await readAuthorizedAdminContext();
  const access = await resolveCurrentAdminAccess();

  if (!operation.ok || access.status !== "allowed") {
    return <AccessDenied />;
  }

  const t = await getTranslations("admin.applications");

  return (
    <div className="stack-section">
      <AdminSectionPlaceholder
        title={t("form.createTitle")}
        description={t("form.createIntro")}
      />
      <NextLink
        href={APPLICATIONS_PATH}
        className="type-small text-muted-foreground hover:text-foreground"
      >
        {t("form.back")}
      </NextLink>
      <ApplicationForm mode="create" copy={await applicationFormCopy()} />
    </div>
  );
}

export async function AdminApplicationEditPage({
  applicationKey,
}: {
  applicationKey: string;
}) {
  const operation = await readAuthorizedAdminContext();
  const access = await resolveCurrentAdminAccess();

  if (!operation.ok || access.status !== "allowed") {
    return <AccessDenied />;
  }

  const result = await getJobApplication(
    access,
    getJobApplicationService(),
    applicationKey,
  );

  if (!result.ok) {
    if (result.code === "notFound") {
      notFound();
    }

    const t = await getTranslations("admin.applications");
    return (
      <p role="alert" className="type-small text-destructive">
        {t("unavailable")}
      </p>
    );
  }

  const t = await getTranslations("admin.applications");

  return (
    <div className="stack-section">
      <AdminSectionPlaceholder
        title={t("form.editTitle")}
        description={t("form.editIntro")}
      />
      <NextLink
        href={applicationDetailPath(result.value.key)}
        className="type-small text-muted-foreground hover:text-foreground"
      >
        {t("form.backToDetail")}
      </NextLink>
      <ApplicationForm
        mode="edit"
        application={result.value}
        copy={await applicationFormCopy()}
      />
    </div>
  );
}
