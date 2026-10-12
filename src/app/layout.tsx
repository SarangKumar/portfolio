import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import { LabelsProvider } from "@/components/site/labels-provider";
import { PageTransition } from "@/components/site/page-transition";
import { SiteChrome } from "@/components/site/site-chrome";
import { SiteFooter } from "@/components/site/site-footer";
import { themeScript } from "@/components/site/theme-toggle";
import { getContent } from "@/lib/content";
import { buildIndex } from "@/lib/derive";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
    title: { default: site.seo.title, template: site.seo.titleTemplate },
    description: site.seo.description,
    openGraph: {
      title: site.seo.title,
      description: site.seo.description,
      siteName: site.name,
      type: "website",
    },
    authors: [{ name: site.name }],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const content = await getContent();
  const { site } = content;
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${serif.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <LabelsProvider labels={site.labels}>
          <SiteChrome
            nav={site.nav}
            data={{
              name: site.name,
              role: site.role,
              location: site.location,
              handle: site.handle,
              career: `${site.career.label} — ${site.career.detail}`,
              email: site.email,
              links: site.links,
              index: buildIndex(content),
            }}
          />
          <main id="content" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter name={site.name} email={site.email} links={site.links} />
        </LabelsProvider>
      </body>
    </html>
  );
}
