import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Download,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Site icon scale: 16px / 1.75 inline, 20px in the navbar. */
export const ICON = { size: 16, strokeWidth: 1.75 } as const;
export const NAV_ICON = { size: 20, strokeWidth: 1.75 } as const;

const GLYPHS: Record<string, LucideIcon> = {
  "→": ArrowRight,
  "↗": ArrowUpRight,
  "↓": Download,
  "⬇": Download,
  "←": ArrowLeft,
};
const NAMED = {
  download: Download,
  right: ArrowRight,
  external: ArrowUpRight,
  left: ArrowLeft,
  mail: Mail,
};
export type IconName = keyof typeof NAMED;

/** Strip leading/trailing arrow glyphs that config labels may carry. */
export const stripGlyphs = (s: string) =>
  s.replace(/^\s*[←→↗↓⬇]\s*/, "").replace(/\s*[←→↗↓⬇]\s*$/, "");

/** Pick an icon for a link from its href (mail, GitHub, LinkedIn, PDF, external). */
export function iconForHref(href: string): IconName | undefined {
  if (href.startsWith("mailto:")) return "mail";
  if (/\.pdf($|\?)/.test(href) || href === "resume") return "download";
  if (/^https?:/.test(href)) return "external";
  return undefined;
}

/**
 * Label + Lucide icon on one line. Arrow glyphs in `text` are replaced by the
 * matching icon (leading ← → icon before; trailing → ↗ ↓ → icon after), so
 * config labels never double up. Pass `icon` to force one.
 */
export function IconText({
  text,
  icon,
  before,
  className,
}: {
  text: string;
  icon?: IconName;
  before?: boolean;
  className?: string;
}) {
  const lead = text.match(/^\s*([←→↗↓⬇])/)?.[1];
  const trail = text.match(/([←→↗↓⬇])\s*$/)?.[1];
  const Icon: LucideIcon | undefined = icon
    ? NAMED[icon]
    : (GLYPHS[lead ?? trail ?? ""] as LucideIcon | undefined);
  const isBefore =
    before ?? (icon === "left" || (!icon && !!lead) || icon === "mail");
  const label = stripGlyphs(text);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap",
        className,
      )}
    >
      {Icon && isBefore ? (
        <Icon {...ICON} aria-hidden className="shrink-0" />
      ) : null}
      {label}
      {Icon && !isBefore ? (
        <Icon {...ICON} aria-hidden className="shrink-0" />
      ) : null}
    </span>
  );
}
