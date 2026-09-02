import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./locales";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/about": "/about",
    "/experience": "/experience",
    "/skills": "/skills",
    "/projects": "/projects",
    "/resume": "/resume",
    "/blog": "/blog",
    "/contact": "/contact",
  },
});
