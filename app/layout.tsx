import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DeskPet } from "@/components/desk-pet";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "uglis@home:~",
    template: "%s | uglis@home:~",
  },
  description:
    "林方浩的个人主页 — CLI-style geek portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="scanlines" aria-hidden="true" />
          <div className="crt-glow" aria-hidden="true" />
          <a
            className="absolute left-[-9999px] top-0 bg-accent-green text-black py-[10px] px-[14px] rounded z-[999] no-underline font-mono text-sm focus-visible:left-3 focus-visible:top-3"
            href="#main-content"
          >
            skip to main content
          </a>
          <Header />
          <main
            id="main-content"
            className="w-[min(1000px,94vw)] mx-auto my-6 mb-16"
          >
            {children}
          </main>
          <Footer />
          <DeskPet />
        </ThemeProvider>
      </body>
    </html>
  );
}
