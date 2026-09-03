import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type PreviewCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function PreviewCard({
  eyebrow,
  title,
  description,
  action,
  className,
}: PreviewCardProps) {
  return (
    <Card className={cn("stack-compact surface-interactive", className)}>
      {eyebrow ? (
        <p className="type-label text-muted-foreground">{eyebrow}</p>
      ) : null}
      <p className="type-small font-semibold text-card-foreground">{title}</p>
      {description ? (
        <p className="type-small text-muted-foreground">{description}</p>
      ) : null}
      {action}
    </Card>
  );
}
