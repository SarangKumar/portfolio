import type {
  JobApplicationPriority,
  JobApplicationStatus,
} from "@/career/applications/status";

export type ApplicationActionCopy = {
  archive: string;
  archiveConfirm: string;
  archiveHint: string;
  cancel: string;
  changeStatus: string;
  statusLabel: Record<JobApplicationStatus, string>;
};

export type ApplicationTrackerCopy = ApplicationActionCopy & {
  empty: string;
  emptyFiltered: string;
  search: string;
  searchPlaceholder: string;
  status: string;
  company: string;
  role: string;
  location: string;
  applied: string;
  priority: string;
  nextAction: string;
  nextActionDate: string;
  actions: string;
  anyStatus: string;
  anyPriority: string;
  appliedFrom: string;
  appliedTo: string;
  applyFilters: string;
  clearFilters: string;
  open: string;
  edit: string;
  sortBy: (column: string) => string;
  sortedAsc: string;
  sortedDesc: string;
  page: (input: { page: number; pages: number }) => string;
  previous: string;
  next: string;
  results: (input: { shown: number; total: number }) => string;
  emDash: string;
  priorityLabel: Record<JobApplicationPriority, string>;
};
