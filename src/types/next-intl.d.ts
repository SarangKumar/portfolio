import { enMessages } from "@/i18n/messages";
import type { AppLocale } from "@/i18n/locales";

declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof enMessages;
  }
}
