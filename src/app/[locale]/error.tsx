"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { PageHeader } from "@/components/content/page-header";
import { Button } from "@/components/ui/button";

type ErrorViewProps = {
  error: Error & { digest?: string };
  retry?: () => void;
  reset?: () => void;
};

export default function ErrorView({ error, retry, reset }: ErrorViewProps) {
  const t = useTranslations("errors");
  const recover = retry ?? reset;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="stack-section">
      <PageHeader
        title={t("unexpected.title")}
        description={t("unexpected.description")}
      />
      {recover ? (
        <Button type="button" size="sm" className="w-fit" onClick={recover}>
          {t("unexpected.action")}
        </Button>
      ) : null}
    </div>
  );
}
