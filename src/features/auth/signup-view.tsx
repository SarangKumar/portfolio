import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/content/page-header";
import { ButtonLink } from "@/components/ui/button-link";

export async function SignupView() {
  const t = await getTranslations("auth");

  return (
    <div className="stack-section">
      <PageHeader title={t("signup.title")} description={t("signup.intro")} />
      <ButtonLink href="/login" size="sm" className="w-fit">
        {t("signup.signIn")}
      </ButtonLink>
    </div>
  );
}
