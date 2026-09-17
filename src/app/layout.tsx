import type { Metadata } from "next";
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
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${anton.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-black text-white">
        <SmoothScrollProvider>
          {children}
          <SiteFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
