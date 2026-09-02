"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/components/ui/link";
import { isNavItemActive, navItems, type NavItem } from "@/config/navigation";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type NavLinksProps = {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function NavLinks({ variant, onNavigate }: NavLinksProps) {
  const t = useTranslations("navigation");
  const pathname = usePathname();

  return (
    <ul
      className={cn(
        variant === "desktop" && "flex items-center gap-1",
        variant === "mobile" && "flex flex-col gap-0.5 py-2",
      )}
    >
      {navItems.map((item) => (
        <li key={item.href}>
          <NavLink
            item={item}
            label={t(item.labelKey)}
            pathname={pathname}
            variant={variant}
            onNavigate={onNavigate}
          />
        </li>
      ))}
    </ul>
  );
}

type NavLinkProps = {
  item: NavItem;
  label: string;
  pathname: string;
  variant: NavLinksProps["variant"];
  onNavigate?: () => void;
};

function NavLink({ item, label, pathname, variant, onNavigate }: NavLinkProps) {
  const active = isNavItemActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "relative rounded-sm type-small font-medium text-muted-foreground hover:text-foreground",
        variant === "desktop" && "px-2 py-1",
        variant === "mobile" && "block px-3 py-2",
        active && "text-foreground",
        active &&
          variant === "desktop" &&
          "after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-primary",
        active && variant === "mobile" && "border-l-2 border-primary bg-muted",
      )}
    >
      {label}
    </Link>
  );
}
