import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type {
  JobApplicationPriority,
  JobApplicationStatus,
} from "@/career/applications/status";

const statusVariants: Record<JobApplicationStatus, BadgeVariant> = {
  wishlist: "secondary",
  applied: "info",
  recruiter_contacted: "info",
  oa: "warning",
  technical_1: "warning",
  technical_2: "warning",
  system_design: "warning",
  managerial: "warning",
  hr: "info",
  offer: "success",
  rejected: "destructive",
  withdrawn: "secondary",
  ghosted: "default",
};

const priorityVariants: Record<JobApplicationPriority, BadgeVariant> = {
  low: "secondary",
  medium: "outline",
  high: "warning",
};

type ApplicationStatusBadgeProps = {
  status: JobApplicationStatus;
  labels: Record<JobApplicationStatus, string>;
};

export function ApplicationStatusBadge({
  status,
  labels,
}: ApplicationStatusBadgeProps) {
  return <Badge variant={statusVariants[status]}>{labels[status]}</Badge>;
}

type ApplicationPriorityBadgeProps = {
  priority: JobApplicationPriority;
  labels: Record<JobApplicationPriority, string>;
};

export function ApplicationPriorityBadge({
  priority,
  labels,
}: ApplicationPriorityBadgeProps) {
  return <Badge variant={priorityVariants[priority]}>{labels[priority]}</Badge>;
}
