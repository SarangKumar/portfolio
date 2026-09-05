import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/features/auth/login-form";
import { PageHeader } from "@/components/content/page-header";

type LoginViewProps = {
  callbackUrl: string;
};

export async function LoginView({ callbackUrl }: LoginViewProps) {
  const t = await getTranslations("auth");

  return (
    <div className="stack-section">
      <PageHeader title={t("login.title")} description={t("login.intro")} />
      <LoginForm
        callbackUrl={callbackUrl}
        copy={{
          email: t("login.email"),
          password: t("login.password"),
          submit: t("login.submit"),
          submitting: t("login.submitting"),
          error: t("login.error"),
          rateLimited: t("login.rateLimited"),
          required: t("login.required"),
          invalidEmail: t("login.invalidEmail"),
          tooLong: t("login.tooLong"),
          signup: t("login.signup"),
        }}
      />
    </div>
  );
}
