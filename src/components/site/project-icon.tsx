import Image from "next/image";
import { cn } from "@/lib/utils";

/** App-icon style project mark: every project ships a dark squircle icon. */
export function ProjectIcon({
  src,
  title,
  size = 40,
  className,
}: {
  src?: string;
  title: string;
  size?: number;
  className?: string;
}) {
  if (!src) {
    return (
      <span
        aria-hidden
        style={{ width: size, height: size }}
        className={cn(
          "bg-muted text-muted-foreground inline-flex shrink-0 items-center justify-center rounded-[28%] font-serif",
          className,
        )}
      >
        {title.charAt(0)}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      unoptimized={src.endsWith(".svg")}
      className={cn("shrink-0 rounded-[24%] drop-shadow-sm", className)}
    />
  );
}
