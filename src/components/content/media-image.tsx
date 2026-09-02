import Image from "next/image";
import { cn } from "@/lib/cn";

type MediaImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function MediaImage({
  src,
  alt,
  width,
  height,
  className,
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
}: MediaImageProps) {
  const classes = cn("bg-muted", className);

  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={classes}
      />
    );
  }

  return (
    // Remote hosts are not configured for next/image in this phase.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={classes}
    />
  );
}
