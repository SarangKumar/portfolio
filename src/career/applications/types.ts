import type {
  JobApplicationPriority,
  JobApplicationStatus,
  WorkMode,
} from "@/career/applications/status";

export type InterviewRoundRecord = {
  key: string;
  title: string;
  sortOrder: number;
  scheduledAt: string | null;
};

export type JobApplicationRecord = {
  key: string;
  ownerIdentityId: string;
  company: string;
  companyKey: string | null;
  role: string;
  jobUrl: string | null;
  location: string | null;
  workMode: WorkMode;
  jobDescription: string | null;
  salaryAmount: number | null;
  salaryCurrency: string | null;
  appliedAt: string | null;
  status: JobApplicationStatus;
  source: string | null;
  referral: string | null;
  recruiter: string | null;
  resumeVersionKey: string | null;
  coverLetterKey: string | null;
  notes: string | null;
  priority: JobApplicationPriority;
  nextAction: string | null;
  nextActionAt: string | null;
  rejectionReason: string | null;
  archivedAt: string | null;
  interviewRounds: readonly InterviewRoundRecord[];
  createdAt: string;
  updatedAt: string;
};

export type JobApplicationSummary = {
  key: string;
  company: string;
  role: string;
  status: JobApplicationStatus;
  priority: JobApplicationPriority;
  appliedAt: string | null;
  nextActionAt: string | null;
  archivedAt: string | null;
  updatedAt: string;
};

export type JobApplicationWriteInput = {
  company: string;
  companyKey: string | null;
  role: string;
  jobUrl: string | null;
  location: string | null;
  workMode: WorkMode;
  jobDescription: string | null;
  salaryAmount: number | null;
  salaryCurrency: string | null;
  appliedAt: string | null;
  status: JobApplicationStatus;
  source: string | null;
  referral: string | null;
  recruiter: string | null;
  resumeVersionKey: string | null;
  coverLetterKey: string | null;
  notes: string | null;
  priority: JobApplicationPriority;
  nextAction: string | null;
  nextActionAt: string | null;
  rejectionReason: string | null;
};

export type JobApplicationListQuery = {
  status?: JobApplicationStatus;
  priority?: JobApplicationPriority;
  includeArchived?: boolean;
};
