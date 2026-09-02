import { Badge } from "@/components/ui/badge";

type ProjectTagsProps = {
  tags: readonly string[];
  label?: string;
};

export function ProjectTags({ tags, label }: ProjectTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul aria-label={label} className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <li key={tag}>
          <Badge variant="outline">{tag}</Badge>
        </li>
      ))}
    </ul>
  );
}
