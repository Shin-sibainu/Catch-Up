import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: `${process.env.NEXT_PUBLIC_SITE_NAME} - エンジニアの技術情報キャッチアップ`,
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
  keywords: [
    "技術ブログ",
    "エンジニア",
    "プログラミング",
    "Zenn",
    "Qiita",
    "Hacker News",
    "技術情報",
    "キャッチアップ",
    "開発情報",
  ],
  authors: [
    {
      name: "ShinCode",
    },
  ],
  creator: "ShinCode",
  publisher: process.env.NEXT_PUBLIC_SITE_NAME,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    title: `${process.env.NEXT_PUBLIC_SITE_NAME} - エンジニアの技術情報キャッチアップ`,
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    url: "/",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${process.env.NEXT_PUBLIC_SITE_NAME} - エンジニアの技術情報キャッチアップ`,
    description:
      "Zenn、Qiita、Hacker Newsの最新トレンドを一箇所で効率的にチェック",
    site: "@Shin_Engineer",
    creator: "@Shin_Engineer",
    images: ["/twitter-image"],
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "/",
  },
  // manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ja" suppressHydrationWarning>
        <body
          className={`${notoSansJP.variable} font-sans min-h-screen flex flex-col bg-grid-pattern`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <Header />
            <div className="flex-1 relative">{children}</div>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ""} />
      </html>
    </ClerkProvider>
  );
}
