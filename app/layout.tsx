import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
// import { ClerkProvider } from "@clerk/nextjs";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "CatchUp - エンジニアの技術情報キャッチアップ",
  description: "Zenn、Qiita、Hacker Newsの最新トレンドを一箇所で効率的にチェック",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ClerkProvider>
      <html lang="ja" suppressHydrationWarning>
        <body className={`${notoSansJP.variable} font-sans min-h-screen flex flex-col bg-grid-pattern`}>
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
          </ThemeProvider>
        </body>
      </html>
    // </ClerkProvider>
  );
}