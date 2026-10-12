"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Link as L } from "@/content/types";
import { useT } from "./labels-provider";

export function SiteFooter({
  experienceHref,
  name,
  email,
  links,
}: {
  name: string;
  email: string;
  links: L[];
  experienceHref: string;
}) {
  const pathname = usePathname();
  const t = useT();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="border-border mt-24 border-t">
      <div className="container-x py-16">
        <p className="eyebrow">{t("footer.eyebrow")}</p>
        <a
          href={`mailto:${email}`}
          className="display link-u mt-4 block text-4xl break-all sm:text-6xl"
        >
          {email}
        </a>
        <div className="text-muted-foreground mt-12 flex flex-wrap items-center justify-between gap-4 text-sm">
          <span>
            {t("footer.credit", { year: new Date().getFullYear(), name })}
          </span>
          <span className="flex gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-u"
                target="_blank"
                rel="noreferrer"
              >
                {l.label}
              </a>
            ))}
            <Link href={experienceHref} className="link-u">
              {t("footer.experience")}
            </Link>
            <Link href="/admin" className="link-u">
              {t("footer.admin")}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
