import { Badge } from "@/components/ui/badge";
import type { AppHref } from "@/types/routes";

export type RelatedItem = {
  id: string;
  label: string;
  href?: AppHref;
  query?: string;
  fragment?: string;
};

type RelatedItemListProps = {
  items: readonly RelatedItem[];
  emptyLabel: string;
};

function itemHref(item: RelatedItem): string | undefined {
  if (!item.href) {
    return undefined;
  }

  if (item.query) {
    return `${item.href}?${item.query}`;
  }

  if (item.fragment) {
    return `${item.href}#${item.fragment}`;
  }

  return item.href;
}

export function RelatedItemList({ items, emptyLabel }: RelatedItemListProps) {
  if (items.length === 0) {
    return <p className="type-small text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ul className="flex flex-wrap gap-1">
      {items.map((item) => {
        const href = itemHref(item);

        return (
          <li key={item.id}>
            {href ? (
              <a href={href} className="inline-flex rounded-sm no-underline">
                <Badge variant="outline">{item.label}</Badge>
              </a>
            ) : (
              <Badge variant="outline">{item.label}</Badge>
            )}
          </li>
        );
      })}
    </ul>
  );
}
