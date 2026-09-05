type AdminSectionPlaceholderProps = {
  title: string;
  description: string;
};

export function AdminSectionPlaceholder({
  title,
  description,
}: AdminSectionPlaceholderProps) {
  return (
    <header className="stack-compact border-b border-border pb-4">
      <h1 className="type-heading">{title}</h1>
      <p className="max-w-prose type-small text-muted-foreground">
        {description}
      </p>
    </header>
  );
}
