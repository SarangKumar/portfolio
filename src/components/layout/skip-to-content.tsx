import { getTranslations } from "next-intl/server";

export async function SkipToContent() {
  const t = await getTranslations("accessibility");

  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:border focus:border-border focus:bg-secondary focus:px-2 focus:py-1 focus:type-small focus:text-secondary-foreground"
    >
      {t("skipToContent")}
    </a>
  );
}
