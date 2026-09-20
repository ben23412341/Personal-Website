import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SmoothScrollProvider } from "@/components/site/smooth-scroll-provider";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});


const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Relative URLs in metadata (canonicals, og:image) resolve against this, so
  // it has to be set for any of them to come out absolute.
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: "en_CA",
  },
};

/**
 * Tells Google that the accounts this person posts under and the site they
 * are reading are one and the same. Without it each profile is its own
 * unconnected result, and a name several people share has nothing tying the
 * evidence together.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteConfig.url}/#person`,
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: siteConfig.role,
  // The bio line from the About section: a description of the person, which
  // is what this field is, rather than a description of the site.
  description: siteConfig.about.body[0],
  homeLocation: {
    "@type": "Place",
    name: siteConfig.location,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "ON",
      addressCountry: "CA",
    },
  },
  sameAs: [
    siteConfig.socials.github,
    siteConfig.socials.linkedin,
    siteConfig.socials.medium,
    siteConfig.socials.youtube,
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${anton.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-black text-white">
        {/* Structured data is data, not code, so it goes in a plain script
            tag. The escape is the standard guard against a stray `<` in any
            of these strings closing the tag early. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SmoothScrollProvider>
          {children}
          <SiteFooter />
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}
