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
    "/projects/[slug]": "/projects/[slug]",
    "/resume": "/resume",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/contact": "/contact",
  },
});
