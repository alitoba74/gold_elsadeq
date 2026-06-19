import type { Metadata, Viewport } from "next";
import { Cairo, Tajawal, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/elsadeq/theme-provider";
import { LocaleStateProvider } from "@/components/elsadeq/locale-state";
import { SiteHeader } from "@/components/elsadeq/site-header";
import { SiteFooter } from "@/components/elsadeq/site-footer";
import { BottomNav } from "@/components/elsadeq/bottom-nav";
import { AnnouncementBar } from "@/components/elsadeq/announcement-bar";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gold_elsadeq.vercel.app"),
  title: {
    default: "ELSADEQ - أسعار الذهب والسبائك لحظة بلحظة",
    template: "%s | ELSADEQ",
  },
  description:
    "ELSADEQ - منصة أسعار الذهب والسبائك والجنيه والنص والربع لحظة بلحظة. عيارات 24 و21 و18 و14، سبائك من 1 جرام إلى 1 كيلو، حاسبة الذهب ومحول العملات.",
  keywords: [
    "أسعار الذهب",
    "الذهب في مصر",
    "سبيكة ذهب",
    "جنيه الذهب",
    "ELSADEQ",
    "gold prices",
    "gold bars",
    "gold pound egypt",
    "حاسبة الذهب",
    "محول العملات",
  ],
  authors: [{ name: "ELSADEQ" }],
  creator: "ELSADEQ",
  publisher: "ELSADEQ",
  applicationName: "ELSADEQ",
  keywords: ["ELSADEQ", "gold prices egypt", "أسعار الذهب", "سبائك", "gold pound"],
  alternates: {
    canonical: "/",
    languages: {
      "ar": "/ar",
      "en": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    title: "ELSADEQ - أسعار الذهب والسبائك لحظة بلحظة",
    description: "منصة أسعار الذهب والسبائك والعملات الذهبية لحظة بلحظة",
    siteName: "ELSADEQ",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ELSADEQ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ELSADEQ - Live Gold Prices",
    description: "Live gold & bullion prices - refreshed on every visit",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#FFD700" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${tajawal.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LocaleStateProvider>
            <AnnouncementBar />
            <SiteHeader />
            <main className="flex-1 w-full">{children}</main>
            <SiteFooter />
            <BottomNav />
            <Toaster />
            <SonnerToaster position="top-center" />
          </LocaleStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
