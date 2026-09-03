import type { ReactNode } from "react";
import type { MutationFieldErrors } from "@/cms/result";
import {
  jobApplicationPriorities,
  jobApplicationStatuses,
  workModes,
} from "@/career/applications/status";
import { JOB_APPLICATION_LIMITS } from "@/career/applications/validation";
import type { JobApplicationWriteFields } from "@/career/applications/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminField } from "@/features/admin/admin-field";
import {
  applicationFieldMessage,
  type ApplicationFormCopy,
} from "@/features/admin/applications/application-form-copy";
import { cn } from "@/lib/cn";

const selectClassName = cn(
  "h-8 w-full rounded-sm border border-input bg-background px-2 type-body text-foreground",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-[invalid=true]:border-destructive",
);

type ApplicationFormFieldsProps = {
  values: JobApplicationWriteFields;
  fieldErrors?: MutationFieldErrors;
  pending: boolean;
  copy: ApplicationFormCopy;
};

function describedBy(id: string, error?: string, hint?: boolean) {
  if (error) {
    return `${id}-error`;
  }

  if (hint) {
    return `${id}-hint`;
  }

  return undefined;
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="stack-compact border-b border-border pb-3">
      <h2 className="type-label text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

export function ApplicationFormFields({
  values,
  fieldErrors,
  pending,
  copy,
}: ApplicationFormFieldsProps) {
  const error = (field: string) =>
    applicationFieldMessage(fieldErrors?.[field], copy);

  return (
    <>
      <FormSection title={copy.sections.role}>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField
            id="application-company"
            label={copy.fields.company}
            error={error("company")}
          >
            <Input
              id="application-company"
              name="company"
              maxLength={JOB_APPLICATION_LIMITS.company}
              required
              disabled={pending}
              defaultValue={values.company}
              aria-invalid={Boolean(fieldErrors?.company)}
              aria-describedby={describedBy(
                "application-company",
                fieldErrors?.company,
              )}
            />
          </AdminField>
          <AdminField
            id="application-role"
            label={copy.fields.role}
            error={error("role")}
          >
            <Input
              id="application-role"
              name="role"
              maxLength={JOB_APPLICATION_LIMITS.role}
              required
              disabled={pending}
              defaultValue={values.role}
              aria-invalid={Boolean(fieldErrors?.role)}
              aria-describedby={describedBy(
                "application-role",
                fieldErrors?.role,
              )}
            />
          </AdminField>
          <AdminField
            id="application-job-url"
            label={copy.fields.jobUrl}
            error={error("jobUrl")}
          >
            <Input
              id="application-job-url"
              name="jobUrl"
              type="url"
              maxLength={JOB_APPLICATION_LIMITS.url}
              disabled={pending}
              defaultValue={values.jobUrl}
              aria-invalid={Boolean(fieldErrors?.jobUrl)}
              aria-describedby={describedBy(
                "application-job-url",
                fieldErrors?.jobUrl,
              )}
            />
          </AdminField>
          <AdminField
            id="application-location"
            label={copy.fields.location}
            error={error("location")}
          >
            <Input
              id="application-location"
              name="location"
              maxLength={JOB_APPLICATION_LIMITS.location}
              disabled={pending}
              defaultValue={values.location}
              aria-invalid={Boolean(fieldErrors?.location)}
              aria-describedby={describedBy(
                "application-location",
                fieldErrors?.location,
              )}
            />
          </AdminField>
          <AdminField
            id="application-work-mode"
            label={copy.fields.workMode}
            error={error("workMode")}
          >
            <select
              id="application-work-mode"
              name="workMode"
              disabled={pending}
              defaultValue={values.workMode}
              className={selectClassName}
              aria-invalid={Boolean(fieldErrors?.workMode)}
              aria-describedby={describedBy(
                "application-work-mode",
                fieldErrors?.workMode,
              )}
            >
              {workModes.map((mode) => (
                <option key={mode} value={mode}>
                  {copy.workModeLabel[mode]}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField
            id="application-status"
            label={copy.fields.status}
            error={error("status")}
          >
            <select
              id="application-status"
              name="status"
              required
              disabled={pending}
              defaultValue={values.status}
              className={selectClassName}
              aria-invalid={Boolean(fieldErrors?.status)}
              aria-describedby={describedBy(
                "application-status",
                fieldErrors?.status,
              )}
            >
              {jobApplicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {copy.statusLabel[status]}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField
            id="application-priority"
            label={copy.fields.priority}
            error={error("priority")}
          >
            <select
              id="application-priority"
              name="priority"
              disabled={pending}
              defaultValue={values.priority}
              className={selectClassName}
              aria-invalid={Boolean(fieldErrors?.priority)}
              aria-describedby={describedBy(
                "application-priority",
                fieldErrors?.priority,
              )}
            >
              {jobApplicationPriorities.map((priority) => (
                <option key={priority} value={priority}>
                  {copy.priorityLabel[priority]}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField
            id="application-applied-at"
            label={copy.fields.appliedAt}
            error={error("appliedAt")}
          >
            <Input
              id="application-applied-at"
              name="appliedAt"
              type="date"
              disabled={pending}
              defaultValue={values.appliedAt}
              aria-invalid={Boolean(fieldErrors?.appliedAt)}
              aria-describedby={describedBy(
                "application-applied-at",
                fieldErrors?.appliedAt,
              )}
            />
          </AdminField>
        </div>
      </FormSection>

      <FormSection title={copy.sections.compensation}>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField
            id="application-salary-amount"
            label={copy.fields.salaryAmount}
            error={error("salaryAmount")}
          >
            <Input
              id="application-salary-amount"
              name="salaryAmount"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              disabled={pending}
              defaultValue={values.salaryAmount}
              aria-invalid={Boolean(fieldErrors?.salaryAmount)}
              aria-describedby={describedBy(
                "application-salary-amount",
                fieldErrors?.salaryAmount,
              )}
            />
          </AdminField>
          <AdminField
            id="application-salary-currency"
            label={copy.fields.salaryCurrency}
            hint={copy.fields.salaryCurrencyHint}
            error={error("salaryCurrency")}
          >
            <Input
              id="application-salary-currency"
              name="salaryCurrency"
              maxLength={JOB_APPLICATION_LIMITS.salaryCurrency}
              autoCapitalize="characters"
              disabled={pending}
              defaultValue={values.salaryCurrency}
              aria-invalid={Boolean(fieldErrors?.salaryCurrency)}
              aria-describedby={describedBy(
                "application-salary-currency",
                fieldErrors?.salaryCurrency,
                true,
              )}
            />
          </AdminField>
        </div>
      </FormSection>

      <FormSection title={copy.sections.description}>
        <AdminField
          id="application-job-description"
          label={copy.fields.jobDescription}
          hint={copy.fields.jobDescriptionHint}
          error={error("jobDescription")}
        >
          <Textarea
            id="application-job-description"
            name="jobDescription"
            maxLength={JOB_APPLICATION_LIMITS.jobDescription}
            disabled={pending}
            defaultValue={values.jobDescription}
            aria-invalid={Boolean(fieldErrors?.jobDescription)}
            aria-describedby={describedBy(
              "application-job-description",
              fieldErrors?.jobDescription,
              true,
            )}
          />
        </AdminField>
      </FormSection>

      <FormSection title={copy.sections.sourcing}>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField
            id="application-source"
            label={copy.fields.source}
            error={error("source")}
          >
            <Input
              id="application-source"
              name="source"
              maxLength={JOB_APPLICATION_LIMITS.source}
              disabled={pending}
              defaultValue={values.source}
              aria-invalid={Boolean(fieldErrors?.source)}
              aria-describedby={describedBy(
                "application-source",
                fieldErrors?.source,
              )}
            />
          </AdminField>
          <AdminField
            id="application-referral"
            label={copy.fields.referral}
            error={error("referral")}
          >
            <Input
              id="application-referral"
              name="referral"
              maxLength={JOB_APPLICATION_LIMITS.referral}
              disabled={pending}
              defaultValue={values.referral}
              aria-invalid={Boolean(fieldErrors?.referral)}
              aria-describedby={describedBy(
                "application-referral",
                fieldErrors?.referral,
              )}
            />
          </AdminField>
          <AdminField
            id="application-recruiter"
            label={copy.fields.recruiter}
            error={error("recruiter")}
            className="sm:col-span-2"
          >
            <Input
              id="application-recruiter"
              name="recruiter"
              maxLength={JOB_APPLICATION_LIMITS.recruiter}
              disabled={pending}
              defaultValue={values.recruiter}
              aria-invalid={Boolean(fieldErrors?.recruiter)}
              aria-describedby={describedBy(
                "application-recruiter",
                fieldErrors?.recruiter,
              )}
            />
          </AdminField>
        </div>
      </FormSection>

      <FormSection title={copy.sections.documents}>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField
            id="application-resume-key"
            label={copy.fields.resumeVersionKey}
            hint={copy.fields.resumeVersionKeyHint}
            error={error("resumeVersionKey")}
          >
            <Input
              id="application-resume-key"
              name="resumeVersionKey"
              maxLength={JOB_APPLICATION_LIMITS.referenceKey}
              disabled={pending}
              defaultValue={values.resumeVersionKey}
              aria-invalid={Boolean(fieldErrors?.resumeVersionKey)}
              aria-describedby={describedBy(
                "application-resume-key",
                fieldErrors?.resumeVersionKey,
                true,
              )}
            />
          </AdminField>
          <AdminField
            id="application-cover-letter-key"
            label={copy.fields.coverLetterKey}
            hint={copy.fields.coverLetterKeyHint}
            error={error("coverLetterKey")}
          >
            <Input
              id="application-cover-letter-key"
              name="coverLetterKey"
              maxLength={JOB_APPLICATION_LIMITS.referenceKey}
              disabled={pending}
              defaultValue={values.coverLetterKey}
              aria-invalid={Boolean(fieldErrors?.coverLetterKey)}
              aria-describedby={describedBy(
                "application-cover-letter-key",
                fieldErrors?.coverLetterKey,
                true,
              )}
            />
          </AdminField>
        </div>
      </FormSection>

      <FormSection title={copy.sections.followUp}>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField
            id="application-next-action"
            label={copy.fields.nextAction}
            error={error("nextAction")}
          >
            <Input
              id="application-next-action"
              name="nextAction"
              maxLength={JOB_APPLICATION_LIMITS.nextAction}
              disabled={pending}
              defaultValue={values.nextAction}
              aria-invalid={Boolean(fieldErrors?.nextAction)}
              aria-describedby={describedBy(
                "application-next-action",
                fieldErrors?.nextAction,
              )}
            />
          </AdminField>
          <AdminField
            id="application-next-action-at"
            label={copy.fields.nextActionAt}
            error={error("nextActionAt")}
          >
            <Input
              id="application-next-action-at"
              name="nextActionAt"
              type="date"
              disabled={pending}
              defaultValue={values.nextActionAt}
              aria-invalid={Boolean(fieldErrors?.nextActionAt)}
              aria-describedby={describedBy(
                "application-next-action-at",
                fieldErrors?.nextActionAt,
              )}
            />
          </AdminField>
          <AdminField
            id="application-notes"
            label={copy.fields.notes}
            error={error("notes")}
            className="sm:col-span-2"
          >
            <Textarea
              id="application-notes"
              name="notes"
              maxLength={JOB_APPLICATION_LIMITS.notes}
              disabled={pending}
              defaultValue={values.notes}
              aria-invalid={Boolean(fieldErrors?.notes)}
              aria-describedby={describedBy(
                "application-notes",
                fieldErrors?.notes,
              )}
            />
          </AdminField>
          <AdminField
            id="application-rejection-reason"
            label={copy.fields.rejectionReason}
            error={error("rejectionReason")}
            className="sm:col-span-2"
          >
            <Textarea
              id="application-rejection-reason"
              name="rejectionReason"
              maxLength={JOB_APPLICATION_LIMITS.rejectionReason}
              disabled={pending}
              defaultValue={values.rejectionReason}
              aria-invalid={Boolean(fieldErrors?.rejectionReason)}
              aria-describedby={describedBy(
                "application-rejection-reason",
                fieldErrors?.rejectionReason,
              )}
            />
          </AdminField>
        </div>
      </FormSection>
    </>
  );
}

export function ApplicationFormSubmit({
  pending,
  copy,
}: {
  pending: boolean;
  copy: Pick<ApplicationFormCopy, "save" | "saving">;
}) {
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? copy.saving : copy.save}
    </Button>
  );
}
