import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/content/page-header";
import { UnlockForm } from "@/features/auth/unlock-form";

type UnlockViewProps = {
  callbackUrl: string;
};

export async function UnlockView({ callbackUrl }: UnlockViewProps) {
  const t = await getTranslations("auth");

  return (
    <div className="stack-section">
      <PageHeader title={t("unlock.title")} description={t("unlock.intro")} />
      <UnlockForm
        callbackUrl={callbackUrl}
        copy={{
          password: t("unlock.password"),
          submit: t("unlock.submit"),
          submitting: t("unlock.submitting"),
          error: t("unlock.error"),
          rateLimited: t("unlock.rateLimited"),
        }}
      />
    </div>
  );
}
