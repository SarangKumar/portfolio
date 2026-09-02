import { getTranslations } from "next-intl/server";

export async function SkipToContent() {
  const t = await getTranslations("accessibility");

  return (
    <a href="#content" className="skip-link">
      {t("skipToContent")}
    </a>
  );
}
