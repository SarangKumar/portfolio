import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { Link } from "@/components/ui/link";
import { navItems } from "@/config/navigation";

export async function SiteFooter() {
  const tNav = await getTranslations("navigation");
  const tCommon = await getTranslations("common");
  const tA11y = await getTranslations("accessibility");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <PageContainer className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <p className="type-metadata">
          {tCommon("copyright", { year, name: tCommon("appName") })}
        </p>
        <nav aria-label={tA11y("footer")}>
          <ul className="flex flex-wrap gap-x-3 gap-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} variant="muted" className="type-small">
                  {tNav(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageContainer>
    </footer>
  );
}
