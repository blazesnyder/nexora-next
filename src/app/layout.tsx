import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import AdScript from "@/components/ads/AdScript";
import AdsterraSocialBar from "@/components/ads/AdsterraSocialBar";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LanguageProvider } from "@/lib/use-translation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexora-next.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nexora-Next — AI, Gaming, Esports & Tech News",
    template: "%s | Nexora-Next",
  },
  description:
    "Nexora-Next covers AI agents, gaming world, esports, and tech news. In-depth reviews, tutorials, and a comprehensive codex of tech terms.",
  manifest: "/manifest.webmanifest",
  other: {
    "theme-color": "#09090b",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nexora-Next",
    title: "Nexora-Next — AI, Gaming, Esports & Tech News",
    description:
      "Nexora-Next covers AI agents, gaming world, esports, and tech news.",
    images: [
      {
        url: `${siteUrl}/images/og-default.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora-Next — AI, Gaming, Esports & Tech News",
    description:
      "Nexora-Next covers AI agents, gaming world, esports, and tech news.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-page: #070708;
                --color-card: #141416;
                --color-card-alt: #1a1a1e;
                --color-header: rgba(7, 7, 8, 0.82);
                --color-filter: #202024;
                --color-primary: #f0f0f2;
                --color-secondary: #9898a0;
                --color-muted: #6b6b76;
                --color-dim: #4a4a54;
                --color-line: #1e1e22;
                --color-line-hover: #2e2e36;
                --color-accent: #b91c1c;
                --color-accent-alt: #c2410c;
                --color-gold: #b8860b;
                --color-glow: rgba(185, 28, 28, 0.12);
              }
              [data-theme="light"] {
                --color-page: #f8f8fa;
                --color-card: #ffffff;
                --color-card-alt: #f2f2f5;
                --color-header: rgba(248, 248, 250, 0.82);
                --color-filter: #e4e4e8;
                --color-primary: #18181b;
                --color-secondary: #52525b;
                --color-muted: #71717a;
                --color-dim: #a1a1aa;
                --color-line: #e4e4e8;
                --color-line-hover: #d4d4d8;
                --color-accent: #b91c1c;
                --color-accent-alt: #c2410c;
                --color-gold: #b8860b;
                --color-glow: rgba(185, 28, 28, 0.06);
              }
              body {
                background: linear-gradient(180deg, #1a0a0a 0%, #070708 100%);
                background-attachment: fixed;
                min-height: 100vh;
              }
              body::after {
                content: "";
                position: fixed;
                inset: 0;
                z-index: 9999;
                pointer-events: none;
                opacity: 0.035;
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                background-repeat: repeat;
                background-size: 256px 256px;
              }
              @media (prefers-color-scheme: light) {
                :root:not([data-theme="dark"]) {
                  --color-page: #f8f8fa;
                  --color-card: #ffffff;
                  --color-card-alt: #f2f2f5;
                  --color-header: rgba(248, 248, 250, 0.82);
                  --color-filter: #e4e4e8;
                  --color-primary: #18181b;
                  --color-secondary: #52525b;
                  --color-muted: #71717a;
                  --color-dim: #a1a1aa;
                  --color-line: #e4e4e8;
                  --color-line-hover: #d4d4d8;
                  --color-accent: #b91c1c;
                  --color-accent-alt: #c2410c;
                  --color-gold: #b8860b;
                  --color-glow: rgba(185, 28, 28, 0.06);
                }
              }
              [data-theme="light"] {
                --color-page: #f8f8fa;
                --color-card: #ffffff;
                --color-card-alt: #f2f2f5;
                --color-header: rgba(248, 248, 250, 0.82);
                --color-filter: #e4e4e8;
                --color-primary: #18181b;
                --color-secondary: #52525b;
                --color-muted: #71717a;
                --color-dim: #a1a1aa;
                --color-line: #e4e4e8;
                --color-line-hover: #d4d4d8;
                --color-accent: #b91c1c;
                --color-accent-alt: #c2410c;
                --color-gold: #b8860b;
                --color-glow: rgba(185, 28, 28, 0.06);
              }
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-page text-primary">
        <ThemeProvider>
          <LanguageProvider>
            <div className="animate-fade-in flex-1 flex flex-col">{children}</div>
          </LanguageProvider>
        </ThemeProvider>
        <ScrollToTop />
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <AdScript />
        <AdsterraSocialBar />
      </body>
    </html>
  );
}