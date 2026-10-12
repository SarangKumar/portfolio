import { Download } from "lucide-react";
import type { SiteConfig } from "@/content/types";
import { cn } from "@/lib/utils";

/** Pulsing availability dot (orange when open, muted otherwise). */
export function StatusDot({
  on,
  className,
}: {
  on: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("relative inline-flex size-2.5", className)}
      aria-hidden
    >
      {on ? (
        <span className="bg-primary absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:hidden" />
      ) : null}
      <span
        className={cn(
          "relative size-2.5 rounded-full",
          on ? "bg-primary" : "bg-muted-foreground",
        )}
      />
    </span>
  );
}

/** Config-driven "Open to work" block (site.career). Renders nothing when off. */
export function OpenToWork({
  career,
  resumeUrl,
  className,
}: {
  career: SiteConfig["career"];
  resumeUrl?: string;
  className?: string;
}) {
  if (!career.available) return null;
  const ctas = (career.ctas ?? [])
    .map((c) => ({
      ...c,
      href: c.href === "resume" ? (resumeUrl ?? "") : c.href,
    }))
    .filter((c) => c.href);
  return (
    <div
      className={cn(
        "border-primary/40 bg-primary/[0.06] relative rounded-3xl border p-6 sm:p-8",
        className,
      )}
    >
      <p className="eyebrow text-primary flex items-center gap-3">
        <StatusDot on />
        {career.label}
      </p>
      <p className="display mt-3 text-3xl sm:text-4xl">{career.headline}</p>
      {career.roles?.length ? (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Roles">
          {career.roles.map((r) => (
            <li key={r} className="chip border-primary/40 text-foreground">
              {r}
            </li>
          ))}
        </ul>
      ) : null}
      {career.detail ? (
        <p className="text-muted-foreground mt-4 text-sm">{career.detail}</p>
      ) : null}
      {ctas.length ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {ctas.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              {...(c.href.startsWith("http") || c.href.endsWith(".pdf")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
              {...(c.href.endsWith(".pdf") ? { download: true } : {})}
              className={cn(
                "inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-medium transition-colors",
                i === 0
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-border hover:border-primary border",
              )}
            >
              {c.href.endsWith(".pdf") ? (
                <Download className="size-4 shrink-0" aria-hidden />
              ) : null}
              {c.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
