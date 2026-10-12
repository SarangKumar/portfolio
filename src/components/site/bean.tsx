import { cn } from "@/lib/utils";

/** The bean mark: an asymmetric bean with a soft centre crease. */
export function BeanMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-6", className)}>
      <path
        d="M16 3c6.8 0 12 4.6 12 11.6C28 23 22.2 29 15.4 29 8.7 29 4 24.3 4 17.8 4 9.6 9.4 3 16 3Z"
        className="fill-primary"
      />
      <path
        d="M17.5 7.5c-3.2 3-3.6 6.2-1.6 9.3 1.8 2.8 1.3 5.7-1.4 8.4"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="stroke-background"
      />
    </svg>
  );
}

export function BeanBlob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "bean bg-primary/15 pointer-events-none absolute blur-2xl",
        className,
      )}
    />
  );
}
