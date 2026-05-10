import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="w-[min(1000px,94vw)] mx-auto mt-4 px-4 py-3 flex items-center justify-between border border-line rounded-lg bg-surface backdrop-blur-md sticky top-3 z-40">
      <div className="flex items-center gap-3">
        <div className="flex gap-[6px]">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
        </div>
        <Link
          href="/"
          className="text-xs text-muted hover:text-accent-green no-underline tracking-wider"
        >
          uglis@home:~/
        </Link>
      </div>

      <nav className="flex gap-1 items-center" aria-label="站点导航">
        {[
          ["/", "index"],
          ["/posts", "posts/"],
          ["/moments", "moments/"],
          ["/admin", "admin/"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="text-xs text-muted hover:text-accent-green no-underline px-2 py-1 rounded hover:bg-bg-alt transition-colors"
          >
            {label}
          </Link>
        ))}
        <span className="text-line mx-1">|</span>
        <ThemeToggle />
      </nav>
    </header>
  );
}
