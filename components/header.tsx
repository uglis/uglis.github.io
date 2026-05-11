import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="w-[min(1000px,94vw)] mx-auto mt-2 sm:mt-4 px-3 sm:px-4 py-2 sm:py-3 flex flex-wrap items-center justify-between border border-line rounded-lg bg-surface backdrop-blur-md sticky top-2 sm:top-3 z-40 gap-y-1.5">
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex gap-1 sm:gap-[6px]">
          <span className="terminal-dot red !w-[10px] !h-[10px] sm:!w-[12px] sm:!h-[12px]" />
          <span className="terminal-dot yellow !w-[10px] !h-[10px] sm:!w-[12px] sm:!h-[12px]" />
          <span className="terminal-dot green !w-[10px] !h-[10px] sm:!w-[12px] sm:!h-[12px]" />
        </div>
        <Link
          href="/"
          className="text-[11px] sm:text-xs text-muted hover:text-accent-green no-underline tracking-wider truncate max-w-[120px] sm:max-w-none"
        >
          uglis@home:~/
        </Link>
      </div>

      <nav className="flex gap-0.5 sm:gap-1 items-center overflow-x-auto scrollbar-none" aria-label="站点导航">
        {[
          ["/", "index"],
          ["/posts", "posts/"],
          ["/moments", "moments/"],
          ["/admin", "admin/"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="text-[11px] sm:text-xs text-muted hover:text-accent-green no-underline px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hover:bg-bg-alt transition-colors whitespace-nowrap"
          >
            {label}
          </Link>
        ))}
        <span className="text-line mx-0.5 sm:mx-1 text-xs">|</span>
        <ThemeToggle />
      </nav>
    </header>
  );
}
