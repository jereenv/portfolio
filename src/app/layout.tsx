import { CommandPalette } from "@/components/command-palette";
import { KonamiConfetti } from "@/components/konami-confetti";
import Navbar from "@/components/navbar";
import { ScrollProgress } from "@/components/scroll-progress";
import { ShortcutsOverlay } from "@/components/shortcuts-overlay";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: `${DATA.name} — Software Engineer`,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  keywords: [
    "Jereen Valsson",
    "Software Engineer",
    "Backend Engineer",
    "Distributed Systems",
    "Go",
    "Python",
    "Grafana Labs",
    "Kubernetes",
    "Kafka",
  ],
  authors: [{ name: DATA.name, url: DATA.url }],
  creator: DATA.name,
  openGraph: {
    title: `${DATA.name} — Software Engineer`,
    description: DATA.description,
    url: DATA.url,
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name} — Software Engineer`,
    description: DATA.description,
    card: "summary_large_image",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: DATA.name,
  url: DATA.url,
  image: `${DATA.url}${DATA.avatarUrl}`,
  jobTitle: "Software Engineer",
  worksFor: {
    "@type": "Organization",
    name: DATA.currentRole.company,
    url: DATA.currentRole.href,
  },
  alumniOf: DATA.education.map((e) => ({
    "@type": "EducationalOrganization",
    name: e.school,
    url: e.href,
  })),
  sameAs: Object.values(DATA.contact.social).map((s) => s.url),
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    addressCountry: "US",
  },
  knowsAbout: [
    "Distributed Systems",
    "Backend Engineering",
    "Go",
    "Python",
    "Kubernetes",
    "Kafka",
    "AWS",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ScrollProgress />
          <CommandPalette />
          <ShortcutsOverlay />
          <KonamiConfetti />
          <TooltipProvider delayDuration={0}>
            {children}
            <Navbar />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
