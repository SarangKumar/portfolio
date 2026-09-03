import type {
  JobApplicationPriority,
  JobApplicationStatus,
  WorkMode,
} from "@/career/applications/status";

export type ApplicationFormCopy = {
  save: string;
  saving: string;
  saved: string;
  sections: {
    role: string;
    compensation: string;
    description: string;
    sourcing: string;
    documents: string;
    followUp: string;
  };
  fields: {
    company: string;
    role: string;
    jobUrl: string;
    location: string;
    workMode: string;
    jobDescription: string;
    jobDescriptionHint: string;
    salaryAmount: string;
    salaryCurrency: string;
    salaryCurrencyHint: string;
    appliedAt: string;
    status: string;
    source: string;
    referral: string;
    recruiter: string;
    resumeVersionKey: string;
    resumeVersionKeyHint: string;
    coverLetterKey: string;
    coverLetterKeyHint: string;
    notes: string;
    priority: string;
    nextAction: string;
    nextActionAt: string;
    rejectionReason: string;
  };
  errors: {
    required: string;
    tooLong: string;
    invalidUrl: string;
    invalidDate: string;
    invalid: string;
    incomplete: string;
    unauthorized: string;
    notFound: string;
    unavailable: string;
  };
  statusLabel: Record<JobApplicationStatus, string>;
  priorityLabel: Record<JobApplicationPriority, string>;
  workModeLabel: Record<WorkMode, string>;
};

export function applicationFieldMessage(
  code: string | undefined,
  copy: ApplicationFormCopy,
): string | undefined {
  if (code === "required") {
    return copy.errors.required;
  }

  if (code === "tooLong") {
    return copy.errors.tooLong;
  }

  if (code === "invalidUrl") {
    return copy.errors.invalidUrl;
  }

  if (code === "invalidDate") {
    return copy.errors.invalidDate;
  }

  if (code === "invalid") {
    return copy.errors.invalid;
  }

  if (code === "incomplete") {
    return copy.errors.incomplete;
  }

  return undefined;
}
