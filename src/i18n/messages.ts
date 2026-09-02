import about from "../../messages/en/about.json";
import accessibility from "../../messages/en/accessibility.json";
import blog from "../../messages/en/blog.json";
import common from "../../messages/en/common.json";
import contact from "../../messages/en/contact.json";
import errors from "../../messages/en/errors.json";
import experience from "../../messages/en/experience.json";
import home from "../../messages/en/home.json";
import navigation from "../../messages/en/navigation.json";
import projects from "../../messages/en/projects.json";
import resume from "../../messages/en/resume.json";
import skills from "../../messages/en/skills.json";
import terminal from "../../messages/en/terminal.json";
import { type AppLocale } from "./locales";

export const enMessages = {
  navigation,
  common,
  home,
  about,
  experience,
  skills,
  projects,
  resume,
  blog,
  contact,
  terminal,
  accessibility,
  errors,
};

export const messagesByLocale = {
  en: enMessages,
} satisfies Record<AppLocale, typeof enMessages>;

export type Messages = (typeof messagesByLocale)[AppLocale];

export function getMessagesForLocale(locale: AppLocale): Messages {
  return messagesByLocale[locale];
}
