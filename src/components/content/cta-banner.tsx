import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CtaBannerProps = {
  id?: string;
  title: string;
  body: string;
  action: ReactNode;
  className?: string;
};

export function CtaBanner({
  id,
  title,
  body,
  action,
  className,
}: CtaBannerProps) {
  return (
    <Card
      id={id}
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="stack-compact min-w-0">
        <h2 className="type-heading">{title}</h2>
        <p className="type-small text-muted-foreground">{body}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </Card>
  );
}
