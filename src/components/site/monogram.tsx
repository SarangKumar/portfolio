import { cn } from "@/lib/utils";

type MonogramProps = {
  className?: string;
};

/** Gold "SK" mark with a breathing glow underneath (Aavedak logo treatment). */
export function Monogram({ className }: MonogramProps) {
  return (
    <span
      className={cn(
        "relative inline-flex size-9 shrink-0 items-center justify-center",
        className,
      )}
    >
      <span
        aria-hidden
        className="glow-breathe bg-primary/60 absolute inset-x-1 -bottom-1 h-3 rounded-full blur-md"
      />
      <span className="bg-primary text-primary-foreground relative flex size-9 items-center justify-center rounded-lg font-mono text-sm font-semibold shadow-[0_0_18px_var(--logo-glow)] transition-transform duration-200 group-hover:scale-105">
        SK
      </span>
    </span>
  );
}
