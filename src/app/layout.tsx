import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import { portfolio } from "@/lib/portfolio";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const data = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-data", display: "swap" });

const { seo } = portfolio.settings;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  ...(seo.siteUrl ? { metadataBase: new URL(seo.siteUrl) } : {}),
  authors: [{ name: portfolio.personal.name }],
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    siteName: portfolio.personal.shortName,
    ...(seo.ogImage ? { images: [seo.ogImage] } : {}),
  },
  twitter: {
    card: seo.ogImage ? "summary_large_image" : "summary",
    title: seo.title,
    description: seo.description,
    ...(seo.ogImage ? { images: [seo.ogImage] } : {}),
  },
};

export const viewport: Viewport = { themeColor: "#F1F2EE", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  const sameAs = [portfolio.social.github.url, portfolio.social.linkedin.url].filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolio.personal.name,
    jobTitle: portfolio.personal.title,
    email: `mailto:${portfolio.personal.email}`,
    address: { "@type": "PostalAddress", addressLocality: portfolio.personal.location },
    ...(sameAs.length ? { sameAs } : {}),
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${data.variable}`}>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-50 -translate-y-24 rounded-lg bg-ink px-4 py-3 font-medium text-paper focus:translate-y-0"
        >
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
