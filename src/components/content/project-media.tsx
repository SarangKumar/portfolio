import type { ProjectMedia } from "@/data/projects";
import { cn } from "@/lib/cn";

type ProjectMediaGalleryProps = {
  items: readonly ProjectMedia[];
  label: string;
};

export function ProjectMediaGallery({
  items,
  label,
}: ProjectMediaGalleryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul aria-label={label} className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.src}
          className="overflow-hidden rounded-md border border-border"
        >
          {item.kind === "video" ? (
            <video
              src={item.src}
              aria-label={item.alt}
              className="aspect-video w-full bg-muted"
              controls
              playsInline
            />
          ) : (
            // Local and remote media are authored; next/image remote hosts are not configured yet.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.src}
              alt={item.alt}
              width={item.width ?? 1200}
              height={item.height ?? 675}
              className={cn("aspect-video w-full object-cover bg-muted")}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
