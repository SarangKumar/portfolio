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
  location: string | null;
  priority: JobApplicationPriority;
  nextAction: string | null;
  appliedAt: string | null;
  nextActionAt: string | null;
  archivedAt: string | null;
  updatedAt: string;
};

export type JobApplicationStatusHistoryRecord = {
  key: string;
  applicationKey: string;
  ownerIdentityId: string;
  sequence: number;
  previousStatus: JobApplicationStatus | null;
  newStatus: JobApplicationStatus;
  changedAt: string;
  changedByIdentityId: string;
  reason: string | null;
  note: string | null;
};

export type JobApplicationStatusChangeExtras = {
  reason?: string | null;
  note?: string | null;
  rejectionReason?: string | null;
};

export type JobApplicationStatusChangePatch = {
  newStatus: JobApplicationStatus;
  changedAt: string;
  changedByIdentityId: string;
  reason: string | null;
  note: string | null;
  rejectionReason?: string | null;
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

export type JobApplicationSortField =
  | "company"
  | "role"
  | "status"
  | "location"
  | "appliedAt"
  | "priority"
  | "nextActionAt";

export type JobApplicationSortDirection = "asc" | "desc";

export type JobApplicationListQuery = {
  search?: string;
  status?: JobApplicationStatus;
  company?: string;
  location?: string;
  priority?: JobApplicationPriority;
  appliedFrom?: string;
  appliedTo?: string;
  includeArchived?: boolean;
  sort?: JobApplicationSortField;
  dir?: JobApplicationSortDirection;
  page?: number;
  pageSize?: number;
};

export type JobApplicationListPage = {
  items: readonly JobApplicationSummary[];
  total: number;
  page: number;
  pageSize: number;
};
