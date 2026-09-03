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
    "/login": "/login",
    "/admin": "/admin",
    "/admin/applications": "/admin/applications",
    "/admin/jobs": "/admin/jobs",
    "/admin/interviews": "/admin/interviews",
    "/admin/companies": "/admin/companies",
    "/admin/resumes": "/admin/resumes",
    "/admin/letters": "/admin/letters",
    "/admin/notes": "/admin/notes",
    "/admin/analytics": "/admin/analytics",
    "/admin/settings": "/admin/settings",
  },
});
