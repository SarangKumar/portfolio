import { getTranslations } from "next-intl/server";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { PageContainer } from "@/components/layout/page-container";
import { Link } from "@/components/ui/link";

export async function SiteHeader() {
  const tCommon = await getTranslations("common");
  const tA11y = await getTranslations("accessibility");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <PageContainer className="flex h-12 items-center justify-between gap-4">
        <Link
          href="/"
          className="shrink-0 type-small font-semibold tracking-tight text-foreground hover:text-primary"
        >
          {tCommon("appName")}
        </Link>
        <nav aria-label={tA11y("main")} className="hidden md:block">
          <NavLinks variant="desktop" />
        </nav>
        <MobileNav />
      </PageContainer>
    </header>
  );
}
