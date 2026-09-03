import type {
  JobApplicationPriority,
  WorkMode,
} from "@/career/applications/status";
import type { ApplicationActionCopy } from "@/features/admin/applications/application-tracker-copy";

export type ApplicationDetailCopy = ApplicationActionCopy & {
  back: string;
  openJob: string;
  edit: string;
  archived: string;
  information: string;
  status: string;
  applied: string;
  source: string;
  jobUrl: string;
  location: string;
  workMode: string;
  salary: string;
  priority: string;
  rejectionReason: string;
  jobDescription: string;
  jobDescriptionEmpty: string;
  recruiter: string;
  recruiterName: string;
  referral: string;
  resume: string;
  resumeEmpty: string;
  coverLetter: string;
  coverLetterEmpty: string;
  notes: string;
  notesEmpty: string;
  nextAction: string;
  nextActionEmpty: string;
  due: string;
  interviews: string;
  interviewsEmpty: string;
  interviewsHint: string;
  unscheduled: string;
  statusHistory: string;
  statusHistoryHint: string;
  historyEmpty: string;
  statusCurrent: string;
  initialStatus: string;
  changedBy: string;
  reason: string;
  note: string;
  rejectionReasonHint: string;
  saveStatus: string;
  historyUnavailable: string;
  updated: string;
  created: string;
  refKey: string;
  saved: string;
  emDash: string;
  priorityLabel: Record<JobApplicationPriority, string>;
  workModeLabel: Record<WorkMode, string>;
};
