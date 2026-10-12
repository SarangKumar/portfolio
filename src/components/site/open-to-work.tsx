import type { SiteConfig } from "@/content/types";
import { MapPin } from "lucide-react";
import { ICON, IconText, iconForHref } from "./icon-text";
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

/** Config-driven, understated "open to work" line (site.career). Nothing when off. */
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
    <div className={cn("space-y-2", className)}>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <StatusDot on />
        <span className="font-serif text-xl sm:text-2xl">
          {career.headline}
        </span>
      </p>
      {career.roles?.length ? (
        <div className="pl-[1.375rem]">
          <div className="overflow-hidden">
            <ul
              aria-label="Roles"
              className="roles-list text-muted-foreground font-mono text-xs tracking-wide sm:text-sm"
            >
              {career.roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
      <p className="text-muted-foreground flex flex-wrap items-center gap-x-5 gap-y-1 pl-[1.375rem] text-sm">
        {career.locations ? (
          <span className="inline-flex items-center gap-1.5">
            <MapPin {...ICON} aria-hidden className="shrink-0" />
            {career.locations}
          </span>
        ) : null}
        {career.detail ? <span>{career.detail}</span> : null}
        {ctas.map((c) => (
          <a
            key={c.label}
            href={c.href}
            {...(c.href.startsWith("http") || c.href.endsWith(".pdf")
              ? { target: "_blank", rel: "noreferrer" }
              : {})}
            {...(c.href.endsWith(".pdf") ? { download: true } : {})}
            className="text-foreground hover:text-primary decoration-primary inline-flex min-h-11 items-center underline-offset-4 transition-colors hover:underline"
          >
            <IconText
              text={c.label}
              icon={/[←→↗↓⬇]/.test(c.label) ? undefined : iconForHref(c.href)}
            />
          </a>
        ))}
      </p>
    </div>
  );
}
