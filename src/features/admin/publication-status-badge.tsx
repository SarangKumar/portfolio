import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type { PublicationStatus } from "@/content/status";

const variants: Record<PublicationStatus, BadgeVariant> = {
  draft: "warning",
  published: "success",
  archived: "secondary",
};

type PublicationStatusBadgeProps = {
  status: PublicationStatus;
  labels: Record<PublicationStatus, string>;
};

export function PublicationStatusBadge({
  status,
  labels,
}: PublicationStatusBadgeProps) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
