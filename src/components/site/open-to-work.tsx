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
  const meta = [career.locations, career.detail?.replace(/\.\s*$/, "")].filter(
    Boolean,
  ) as string[];
  return (
    <div className={cn("space-y-4", className)}>
      <p className="flex items-center gap-3">
        <StatusDot on />
        <span className="font-serif text-xl leading-tight sm:text-2xl">
          {career.headline}
        </span>
      </p>
      <div className="space-y-3 sm:pl-[1.375rem]">
        {career.roles?.length ? (
          <ul aria-label="Roles" className="flex flex-wrap gap-2">
            {career.roles.map((r) => (
              <li
                key={r}
                className="border-border text-muted-foreground rounded-full border px-2.5 py-0.5 font-mono text-xs tracking-wide"
              >
                {r}
              </li>
            ))}
          </ul>
        ) : null}
        {meta.length ? (
          <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
            <MapPin {...ICON} aria-hidden className="mt-0.5 shrink-0" />
            <span>
              {meta.map((m, i) => (
                <span key={m}>
                  {i > 0 ? (
                    <span aria-hidden className="text-primary-ink px-1.5">
                      ·
                    </span>
                  ) : null}
                  {m}
                </span>
              ))}
            </span>
          </p>
        ) : null}
        {ctas.length ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-0 pt-1 text-sm sm:gap-x-6">
            {ctas.map((c) => (
              <a
                key={c.label}
                href={c.href}
                {...(c.href.startsWith("http") || c.href.endsWith(".pdf")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                {...(c.href.endsWith(".pdf") ? { download: true } : {})}
                className="text-foreground hover:text-primary-ink decoration-primary inline-flex min-h-11 items-center underline-offset-4 transition-colors hover:underline"
              >
                <IconText
                  text={c.label}
                  icon={
                    /[←→↗↓⬇]/.test(c.label) ? undefined : iconForHref(c.href)
                  }
                />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
