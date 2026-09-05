import { getTranslations } from "next-intl/server";
import { probeDatabaseHealth } from "@/db/probe";
import { cn } from "@/lib/cn";

export async function DatabaseHealthNotice({
  className,
}: {
  className?: string;
}) {
  const health = await probeDatabaseHealth();
  const t = await getTranslations("admin");
  const message =
    health.status === "healthy"
      ? t("database.healthy")
      : health.status === "unconfigured"
        ? t("database.unconfigured")
        : t("database.unreachable");

  return (
    <p
      role={health.ok ? "status" : "alert"}
      className={cn(
        "type-small",
        health.ok ? "text-success" : "text-destructive",
        className,
      )}
    >
      {message}
    </p>
  );
}
