import type { MutationFieldErrors } from "@/cms/result";
import {
  defaultJobApplicationPriority,
  defaultWorkMode,
  isJobApplicationPriority,
  isJobApplicationStatus,
  isWorkMode,
} from "@/career/applications/status";
import type { JobApplicationWriteInput } from "@/career/applications/types";

export const JOB_APPLICATION_LIMITS = {
  company: 160,
  companyKey: 80,
  role: 160,
  url: 2048,
  location: 160,
  jobDescription: 20000,
  salaryCurrency: 3,
  source: 120,
  referral: 160,
  recruiter: 160,
  referenceKey: 80,
  notes: 8000,
  nextAction: 280,
  rejectionReason: 2000,
} as const;

export type JobApplicationField =
  | "company"
  | "companyKey"
  | "role"
  | "jobUrl"
  | "location"
  | "workMode"
  | "jobDescription"
  | "salaryAmount"
  | "salaryCurrency"
  | "appliedAt"
  | "status"
  | "source"
  | "referral"
  | "recruiter"
  | "resumeVersionKey"
  | "coverLetterKey"
  | "notes"
  | "priority"
  | "nextAction"
  | "nextActionAt"
  | "rejectionReason";

export type JobApplicationWriteFields = {
  company: string;
  companyKey?: string;
  role: string;
  jobUrl?: string;
  location?: string;
  workMode?: string;
  jobDescription?: string;
  salaryAmount?: string;
  salaryCurrency?: string;
  appliedAt?: string;
  status: string;
  source?: string;
  referral?: string;
  recruiter?: string;
  resumeVersionKey?: string;
  coverLetterKey?: string;
  notes?: string;
  priority?: string;
  nextAction?: string;
  nextActionAt?: string;
  rejectionReason?: string;
};

function trim(value: string): string {
  return value.trim();
}

function emptyToNull(value: string | undefined): string | null {
  const next = trim(value ?? "");
  return next.length > 0 ? next : null;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateOptionalUrl(
  value: string | undefined,
  field: JobApplicationField,
  fieldErrors: MutationFieldErrors,
): string | null {
  const next = emptyToNull(value);

  if (!next) {
    return null;
  }

  if (next.length > JOB_APPLICATION_LIMITS.url || !isHttpUrl(next)) {
    fieldErrors[field] = "invalidUrl";
    return null;
  }

  return next;
}

function validateOptionalText(
  value: string | undefined,
  field: JobApplicationField,
  max: number,
  fieldErrors: MutationFieldErrors,
): string | null {
  const next = emptyToNull(value);

  if (!next) {
    return null;
  }

  if (next.length > max) {
    fieldErrors[field] = "tooLong";
    return null;
  }

  return next;
}

function parseOptionalInstant(
  value: string | undefined,
  field: JobApplicationField,
  fieldErrors: MutationFieldErrors,
): string | null {
  const next = emptyToNull(value);

  if (!next) {
    return null;
  }

  const isoDate = /^\d{4}-\d{2}-\d{2}$/.test(next)
    ? `${next}T00:00:00.000Z`
    : next;
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    fieldErrors[field] = "invalidDate";
    return null;
  }

  return parsed.toISOString();
}

function parseSalary(
  amountRaw: string | undefined,
  currencyRaw: string | undefined,
  fieldErrors: MutationFieldErrors,
): { amount: number | null; currency: string | null } {
  const amountText = emptyToNull(amountRaw);
  const currencyText = emptyToNull(currencyRaw)?.toUpperCase() ?? null;

  if (!amountText && !currencyText) {
    return { amount: null, currency: null };
  }

  if (!amountText || !currencyText) {
    fieldErrors.salaryAmount = "incomplete";
    fieldErrors.salaryCurrency = "incomplete";
    return { amount: null, currency: null };
  }

  const amount = Number(amountText);

  if (!Number.isFinite(amount) || amount < 0) {
    fieldErrors.salaryAmount = "invalid";
  }

  if (
    currencyText.length !== JOB_APPLICATION_LIMITS.salaryCurrency ||
    !/^[A-Z]{3}$/.test(currencyText)
  ) {
    fieldErrors.salaryCurrency = "invalid";
  }

  if (fieldErrors.salaryAmount || fieldErrors.salaryCurrency) {
    return { amount: null, currency: null };
  }

  return { amount, currency: currencyText };
}

export function validateJobApplicationWriteInput(
  fields: JobApplicationWriteFields,
):
  | { ok: true; value: JobApplicationWriteInput }
  | { ok: false; fieldErrors: MutationFieldErrors } {
  const fieldErrors: MutationFieldErrors = {};
  const company = trim(fields.company);
  const role = trim(fields.role);
  const statusRaw = trim(fields.status);
  const workModeRaw = emptyToNull(fields.workMode);
  const priorityRaw = emptyToNull(fields.priority);

  if (!company) {
    fieldErrors.company = "required";
  } else if (company.length > JOB_APPLICATION_LIMITS.company) {
    fieldErrors.company = "tooLong";
  }

  if (!role) {
    fieldErrors.role = "required";
  } else if (role.length > JOB_APPLICATION_LIMITS.role) {
    fieldErrors.role = "tooLong";
  }

  if (!statusRaw) {
    fieldErrors.status = "required";
  } else if (!isJobApplicationStatus(statusRaw)) {
    fieldErrors.status = "invalid";
  }

  const workMode = workModeRaw ?? defaultWorkMode();

  if (!isWorkMode(workMode)) {
    fieldErrors.workMode = "invalid";
  }

  const priority = priorityRaw ?? defaultJobApplicationPriority();

  if (!isJobApplicationPriority(priority)) {
    fieldErrors.priority = "invalid";
  }

  const companyKey = validateOptionalText(
    fields.companyKey,
    "companyKey",
    JOB_APPLICATION_LIMITS.companyKey,
    fieldErrors,
  );
  const jobUrl = validateOptionalUrl(fields.jobUrl, "jobUrl", fieldErrors);
  const location = validateOptionalText(
    fields.location,
    "location",
    JOB_APPLICATION_LIMITS.location,
    fieldErrors,
  );
  const jobDescription = validateOptionalText(
    fields.jobDescription,
    "jobDescription",
    JOB_APPLICATION_LIMITS.jobDescription,
    fieldErrors,
  );
  const source = validateOptionalText(
    fields.source,
    "source",
    JOB_APPLICATION_LIMITS.source,
    fieldErrors,
  );
  const referral = validateOptionalText(
    fields.referral,
    "referral",
    JOB_APPLICATION_LIMITS.referral,
    fieldErrors,
  );
  const recruiter = validateOptionalText(
    fields.recruiter,
    "recruiter",
    JOB_APPLICATION_LIMITS.recruiter,
    fieldErrors,
  );
  const resumeVersionKey = validateOptionalText(
    fields.resumeVersionKey,
    "resumeVersionKey",
    JOB_APPLICATION_LIMITS.referenceKey,
    fieldErrors,
  );
  const coverLetterKey = validateOptionalText(
    fields.coverLetterKey,
    "coverLetterKey",
    JOB_APPLICATION_LIMITS.referenceKey,
    fieldErrors,
  );
  const notes = validateOptionalText(
    fields.notes,
    "notes",
    JOB_APPLICATION_LIMITS.notes,
    fieldErrors,
  );
  const nextAction = validateOptionalText(
    fields.nextAction,
    "nextAction",
    JOB_APPLICATION_LIMITS.nextAction,
    fieldErrors,
  );
  const rejectionReason = validateOptionalText(
    fields.rejectionReason,
    "rejectionReason",
    JOB_APPLICATION_LIMITS.rejectionReason,
    fieldErrors,
  );
  const appliedAt = parseOptionalInstant(
    fields.appliedAt,
    "appliedAt",
    fieldErrors,
  );
  const nextActionAt = parseOptionalInstant(
    fields.nextActionAt,
    "nextActionAt",
    fieldErrors,
  );
  const salary = parseSalary(
    fields.salaryAmount,
    fields.salaryCurrency,
    fieldErrors,
  );

  if (nextAction && !nextActionAt && !fieldErrors.nextActionAt) {
    fieldErrors.nextActionAt = "required";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  if (!isJobApplicationStatus(statusRaw) || !isWorkMode(workMode)) {
    return { ok: false, fieldErrors: { status: "invalid" } };
  }

  if (!isJobApplicationPriority(priority)) {
    return { ok: false, fieldErrors: { priority: "invalid" } };
  }

  return {
    ok: true,
    value: {
      company,
      companyKey,
      role,
      jobUrl,
      location,
      workMode,
      jobDescription,
      salaryAmount: salary.amount,
      salaryCurrency: salary.currency,
      appliedAt,
      status: statusRaw,
      source,
      referral,
      recruiter,
      resumeVersionKey,
      coverLetterKey,
      notes,
      priority,
      nextAction,
      nextActionAt,
      rejectionReason,
    },
  };
}
