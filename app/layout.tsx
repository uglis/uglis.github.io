import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Fanghao Lin · Personal Website",
    template: "%s · Fanghao Lin",
  },
  description:
    "林方浩的个人主页：我在各种悲喜交集处，能做的只是长途跋涉的归真反璞",
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
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;700&family=Sora:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <a
            className="absolute left-[-9999px] top-0 bg-[#d9ffef] text-[#032517] py-[10px] px-[14px] rounded-[10px] z-[999] no-underline focus-visible:left-3 focus-visible:top-3"
            href="#main-content"
          >
            跳到主要内容
          </a>
          <div className="bg-grid" aria-hidden="true" />
          <div className="bg-radial" aria-hidden="true" />
          <Header />
          <main
            id="main-content"
            className="w-[min(1120px,92vw)] mx-auto my-[26px] mb-[60px] mt-[22px]"
          >
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
