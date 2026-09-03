import type { ReactNode } from "react";
import NextLink from "next/link";
import {
  applicationDetailHref,
  applicationEditHref,
  formatApplicationDate,
  formatApplicationSalary,
} from "@/career/applications/query";
import type {
  JobApplicationRecord,
  JobApplicationStatusHistoryRecord,
} from "@/career/applications/types";
import { MarkdownContent } from "@/components/content/markdown-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExternalAnchorProps } from "@/lib/href";
import {
  ApplicationPriorityBadge,
  ApplicationStatusBadge,
} from "@/features/admin/applications/application-status-badge";
import { ApplicationRowActions } from "@/features/admin/applications/application-row-actions";
import { ApplicationStatusChangeForm } from "@/features/admin/applications/application-status-form";
import { ApplicationStatusHistory } from "@/features/admin/applications/application-status-history";
import type { ApplicationDetailCopy } from "@/features/admin/applications/application-detail-copy";

type ApplicationDetailProps = {
  record: JobApplicationRecord;
  from: string;
  autoFocusStatus: boolean;
  saved: boolean;
  history: readonly JobApplicationStatusHistoryRecord[];
  historyUnavailable: boolean;
  viewerIdentityId: string;
  viewerEmail: string;
  copy: ApplicationDetailCopy;
};

function DetailSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="type-small font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function DetailField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="type-metadata text-muted-foreground">{label}</dt>
      <dd className="type-small break-words">{children}</dd>
    </div>
  );
}

function EmptyValue({ children }: { children: string }) {
  return <span className="text-muted-foreground">{children}</span>;
}

function AssociationValue({
  value,
  empty,
  copy,
}: {
  value: string | null;
  empty: string;
  copy: ApplicationDetailCopy;
}) {
  if (!value) {
    return <EmptyValue>{empty}</EmptyValue>;
  }

  return (
    <p>
      <span className="type-metadata text-muted-foreground">{copy.refKey}</span>{" "}
      <span className="font-mono">{value}</span>
    </p>
  );
}

export function ApplicationDetail({
  record,
  from,
  autoFocusStatus,
  saved,
  history,
  historyUnavailable,
  viewerIdentityId,
  viewerEmail,
  copy,
}: ApplicationDetailProps) {
  const stayOnDetail = applicationDetailHref(record.key, { from });
  const salary = formatApplicationSalary(
    record.salaryAmount,
    record.salaryCurrency,
    copy.emDash,
  );

  return (
    <article className="stack-section">
      <header className="stack-compact border-b border-border pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="type-heading">{record.company}</h1>
            <p className="type-small text-muted-foreground">{record.role}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <ApplicationStatusBadge
              status={record.status}
              labels={copy.statusLabel}
            />
            <ApplicationPriorityBadge
              priority={record.priority}
              labels={copy.priorityLabel}
            />
            {record.archivedAt ? (
              <Badge variant="secondary">{copy.archived}</Badge>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <nav
            aria-label={copy.back}
            className="flex flex-wrap items-center gap-2"
          >
            <NextLink
              href={from}
              className="type-small font-medium text-foreground underline-offset-2 hover:underline"
            >
              {copy.back}
            </NextLink>
            {record.jobUrl ? (
              <a
                href={record.jobUrl}
                className="type-small font-medium text-foreground underline-offset-2 hover:underline"
                {...getExternalAnchorProps(record.jobUrl)}
              >
                {copy.openJob}
              </a>
            ) : null}
            <NextLink
              href={applicationEditHref(record.key, { from })}
              className="type-small font-medium text-foreground underline-offset-2 hover:underline"
            >
              {copy.edit}
            </NextLink>
          </nav>
          <ApplicationRowActions
            applicationKey={record.key}
            status={record.status}
            returnTo={stayOnDetail}
            autoFocusStatus={false}
            showStatusSelect={false}
            copy={copy}
          />
        </div>
        {saved ? (
          <p role="status" className="type-small text-success">
            {copy.saved}
          </p>
        ) : null}
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        <DetailSection title={copy.information}>
          <dl className="grid gap-3 sm:grid-cols-2">
            <DetailField label={copy.status}>
              <ApplicationStatusBadge
                status={record.status}
                labels={copy.statusLabel}
              />
            </DetailField>
            <DetailField label={copy.applied}>
              {formatApplicationDate(record.appliedAt)}
            </DetailField>
            <DetailField label={copy.source}>
              {record.source ?? copy.emDash}
            </DetailField>
            <DetailField label={copy.jobUrl}>
              {record.jobUrl ? (
                <a
                  href={record.jobUrl}
                  className="break-all underline-offset-2 hover:underline"
                  {...getExternalAnchorProps(record.jobUrl)}
                >
                  {record.jobUrl}
                </a>
              ) : (
                copy.emDash
              )}
            </DetailField>
            <DetailField label={copy.location}>
              {record.location ?? copy.emDash}
            </DetailField>
            <DetailField label={copy.workMode}>
              {copy.workModeLabel[record.workMode]}
            </DetailField>
            <DetailField label={copy.salary}>{salary}</DetailField>
            <DetailField label={copy.priority}>
              <ApplicationPriorityBadge
                priority={record.priority}
                labels={copy.priorityLabel}
              />
            </DetailField>
            {record.rejectionReason ? (
              <div className="sm:col-span-2">
                <DetailField label={copy.rejectionReason}>
                  {record.rejectionReason}
                </DetailField>
              </div>
            ) : null}
          </dl>
        </DetailSection>

        <DetailSection title={copy.recruiter}>
          <dl className="grid gap-3 sm:grid-cols-2">
            <DetailField label={copy.recruiterName}>
              {record.recruiter ?? copy.emDash}
            </DetailField>
            <DetailField label={copy.referral}>
              {record.referral ?? copy.emDash}
            </DetailField>
          </dl>
        </DetailSection>

        <DetailSection title={copy.jobDescription} className="lg:col-span-2">
          {record.jobDescription ? (
            <MarkdownContent content={record.jobDescription} />
          ) : (
            <EmptyValue>{copy.jobDescriptionEmpty}</EmptyValue>
          )}
        </DetailSection>

        <DetailSection title={copy.resume}>
          <AssociationValue
            value={record.resumeVersionKey}
            empty={copy.resumeEmpty}
            copy={copy}
          />
        </DetailSection>

        <DetailSection title={copy.coverLetter}>
          <AssociationValue
            value={record.coverLetterKey}
            empty={copy.coverLetterEmpty}
            copy={copy}
          />
        </DetailSection>

        <DetailSection title={copy.notes} className="lg:col-span-2">
          {record.notes ? (
            <p className="whitespace-pre-wrap type-small">{record.notes}</p>
          ) : (
            <EmptyValue>{copy.notesEmpty}</EmptyValue>
          )}
        </DetailSection>

        <DetailSection title={copy.nextAction}>
          {record.nextAction || record.nextActionAt ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailField label={copy.nextAction}>
                {record.nextAction ?? copy.emDash}
              </DetailField>
              <DetailField label={copy.due}>
                {formatApplicationDate(record.nextActionAt)}
              </DetailField>
            </dl>
          ) : (
            <EmptyValue>{copy.nextActionEmpty}</EmptyValue>
          )}
        </DetailSection>

        <DetailSection title={copy.interviews}>
          {record.interviewRounds.length > 0 ? (
            <ol className="stack-compact">
              {[...record.interviewRounds]
                .sort((left, right) => left.sortOrder - right.sortOrder)
                .map((round) => (
                  <li key={round.key} className="type-small">
                    <p className="font-medium">{round.title}</p>
                    <p className="type-metadata text-muted-foreground">
                      {round.scheduledAt
                        ? formatApplicationDate(round.scheduledAt)
                        : copy.unscheduled}
                    </p>
                  </li>
                ))}
            </ol>
          ) : (
            <div className="stack-compact">
              <EmptyValue>{copy.interviewsEmpty}</EmptyValue>
              <p className="type-metadata text-muted-foreground">
                {copy.interviewsHint}
              </p>
            </div>
          )}
        </DetailSection>

        <DetailSection title={copy.statusHistory} className="lg:col-span-2">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
            <ApplicationStatusChangeForm
              applicationKey={record.key}
              status={record.status}
              returnTo={stayOnDetail}
              autoFocusStatus={autoFocusStatus}
              copy={copy}
            />
            {historyUnavailable ? (
              <p role="alert" className="type-small text-destructive">
                {copy.historyUnavailable}
              </p>
            ) : (
              <ApplicationStatusHistory
                entries={history}
                viewerIdentityId={viewerIdentityId}
                viewerEmail={viewerEmail}
                copy={copy}
              />
            )}
          </div>
          <p className="type-metadata text-muted-foreground">
            {copy.created} {formatApplicationDate(record.createdAt)}
          </p>
        </DetailSection>
      </div>
    </article>
  );
}
