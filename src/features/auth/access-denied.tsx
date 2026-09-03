import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/content/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SignOutForm } from "@/features/auth/sign-out-form";

export async function AccessDenied() {
  const t = await getTranslations("auth");

  return (
    <div className="stack-section">
      <PageHeader
        title={t("denied.title")}
        description={t("denied.description")}
      />
      <div className="flex flex-wrap items-center gap-2">
        <ButtonLink href="/" size="sm" className="w-fit">
          {t("denied.home")}
        </ButtonLink>
        <SignOutForm label={t("logout.action")} />
      </div>
    </div>
  );
}
