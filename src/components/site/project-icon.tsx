import Image from "next/image";
import { ViewTransition } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src?: string;
  title: string;
  size?: number;
  className?: string;
  morph?: string;
};

/** App-icon style project mark: every project ships a dark squircle icon. */
export function ProjectIcon({ morph, ...props }: Props) {
  if (!morph) return <Icon {...props} />;
  // Same name on list row + case-study header → the icon morphs across navigation.
  return (
    <ViewTransition name={`icon-${morph}`} share="morph" default="none">
      <span className="inline-flex shrink-0">
        <Icon {...props} />
      </span>
    </ViewTransition>
  );
}

function Icon({ src, title, size = 40, className }: Omit<Props, "morph">) {
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
