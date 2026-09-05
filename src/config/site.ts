import { publicEnv } from "@/lib/env/public";

export const siteConfig = {
  name: "Sarang Kumar",
  url: publicEnv.siteUrl,
  locale: "en",
  openGraphLocale: "en_US",
} as const;
