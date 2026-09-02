import type { ReactNode } from "react";
import { PageViewTracker } from "@/analytics/page-view-tracker";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipToContent } from "@/components/layout/skip-to-content";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipToContent />
      <PageViewTracker />
      <SiteHeader />
      <main id="content" tabIndex={-1} className="flex-1 outline-none">
        <PageContainer className="py-6">{children}</PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
