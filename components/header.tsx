import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="w-[min(1120px,92vw)] mx-auto mt-6 px-[18px] py-[14px] flex justify-between items-center border border-line rounded-full bg-[rgba(11,14,22,0.7)] backdrop-blur-[10px] sticky top-3 z-40 max-[900px]:grid max-[900px]:grid-cols-[1fr_auto] max-[900px]:grid-areas-[logo_controls_nav] max-[900px]:rounded-[18px] max-[900px]:py-3 max-[900px]:gap-y-2">
      <Link
        href="/"
        className="text-text font-serif tracking-[0.04em] no-underline max-[900px]:text-[0.96rem] max-[900px]:max-w-[58vw] max-[900px]:truncate"
      >
        Fanghao Lin&apos;s Homepage
      </Link>

      <nav className="flex gap-[22px] max-[900px]:gap-[10px] max-[900px]:overflow-x-auto max-[900px]:col-span-full max-[900px]:pb-0.5" aria-label="站点导航">
        <Link href="/#about" className="text-muted text-[0.95rem] hover:text-accent no-underline max-[900px]:text-[0.84rem] whitespace-nowrap">关于</Link>
        <Link href="/#projects" className="text-muted text-[0.95rem] hover:text-accent no-underline max-[900px]:text-[0.84rem] whitespace-nowrap">项目</Link>
        <Link href="/posts" className="text-muted text-[0.95rem] hover:text-accent no-underline max-[900px]:text-[0.84rem] whitespace-nowrap">文章</Link>
        <Link href="/moments" className="text-muted text-[0.95rem] hover:text-accent no-underline max-[900px]:text-[0.84rem] whitespace-nowrap">动态</Link>
        <Link href="/admin" className="text-muted text-[0.95rem] hover:text-accent no-underline max-[900px]:text-[0.84rem] whitespace-nowrap">发布</Link>
        <Link href="/#contact" className="text-muted text-[0.95rem] hover:text-accent no-underline max-[900px]:text-[0.84rem] whitespace-nowrap">联系</Link>
      </nav>

      <div className="flex items-center gap-[10px] max-[900px]:justify-end max-[900px]:mt-0">
        <ThemeToggle />
      </div>
    </header>
  );
}
