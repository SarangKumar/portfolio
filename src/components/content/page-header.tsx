import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header
      className={cn("stack-compact border-b border-border pb-8", className)}
    >
      <h1 className="type-display">{title}</h1>
      {description ? (
        <p className="max-w-prose type-body text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}
