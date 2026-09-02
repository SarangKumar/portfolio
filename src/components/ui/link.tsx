import type { ComponentProps } from "react";
import { Link as I18nLink } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { getExternalAnchorProps, isExternalHref } from "@/lib/href";

export { isExternalHref };

export const linkVariants = {
  default: "text-foreground hover:text-primary",
  muted: "text-muted-foreground hover:text-foreground",
} as const;

export type LinkVariant = keyof typeof linkVariants;

const linkClassName = cn(
  "inline-flex items-center gap-1 rounded-sm",
  "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
);

type I18nLinkProps = ComponentProps<typeof I18nLink>;

export type TextLinkProps = Omit<I18nLinkProps, "className"> & {
  variant?: LinkVariant;
  className?: string;
};

export function Link({
  className,
  variant = "default",
  href,
  locale,
  replace,
  scroll,
  prefetch,
  ...props
}: TextLinkProps) {
  const classes = cn(linkClassName, linkVariants[variant], className);

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        className={classes}
        {...getExternalAnchorProps(href)}
        {...props}
      />
    );
  }

  return (
    <I18nLink
      href={href}
      className={classes}
      locale={locale}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch}
      {...props}
    />
  );
}
