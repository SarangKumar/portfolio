import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import { LabelsProvider } from "@/components/site/labels-provider";
import { ParallaxController } from "@/components/site/parallax";
import { PageTransition } from "@/components/site/page-transition";
import { SiteChrome } from "@/components/site/site-chrome";
import { SiteFooter } from "@/components/site/site-footer";
import { themeScript } from "@/components/site/theme-toggle";
import { getContent } from "@/lib/content";
import { buildIndex } from "@/lib/derive";
import { JsonLd } from "@/components/site/json-ld";
import { SITE_URL, abs } from "@/lib/site-url";
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
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: "/" },
    twitter: {
      card: "summary_large_image",
      title: site.seo.title,
      description: site.seo.description,
    },
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
            footerNav={site.footerNav}
            data={{
              name: site.name,
              brand: site.brand || site.name,
              role: site.role,
              location: site.location,
              handle: site.handle,
              career: site.career.available
                ? `${site.career.label}: ${site.career.headline} — ${site.career.roles.join(", ")}. ${site.career.detail}`
                : "Not looking right now.",
              careerOn: site.career.available && site.career.navIndicator,
              careerLabel: site.career.label,
              email: site.email,
              links: site.links,
              resumeUrl: content.resume.pdfUrl,
              index: buildIndex(content),
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": abs("/#person"),
                  name: site.name,
                  jobTitle: site.role,
                  email: `mailto:${site.email}`,
                  url: abs("/"),
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: site.location,
                  },
                  sameAs: site.links
                    .map((l) => l.href)
                    .filter((h) => h.startsWith("http")),
                  knowsAbout: content.skills
                    .filter((s) => !s.hidden)
                    .map((s) => s.name),
                  ...(site.career.available
                    ? {
                        seeks: {
                          "@type": "Demand",
                          name: `${site.career.headline}: ${site.career.roles.join(", ")}`,
                          description: site.career.detail,
                        },
                      }
                    : {}),
                },
                {
                  "@type": "WebSite",
                  "@id": abs("/#website"),
                  url: abs("/"),
                  name: site.seo.title,
                  description: site.seo.description,
                  author: { "@id": abs("/#person") },
                },
              ],
            }}
          />
          <ParallaxController />
          <main id="content" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter
            name={site.name}
            email={site.email}
            links={site.links}
            footerNav={site.footerNav}
          />
        </LabelsProvider>
      </body>
    </html>
  );
}
