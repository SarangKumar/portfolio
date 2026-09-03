import compiledEn from "../../messages/compiled/en.json";
import { type AppLocale } from "./locales";

export const enMessages = compiledEn;

export const messagesByLocale = {
  en: enMessages,
} satisfies Record<AppLocale, typeof enMessages>;

export type Messages = (typeof messagesByLocale)[AppLocale];

export function getMessagesForLocale(locale: AppLocale): Messages {
  return messagesByLocale[locale];
}
