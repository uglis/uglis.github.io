"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="text-xs text-muted hover:text-accent px-2 py-1 rounded cursor-pointer bg-transparent border-0 font-mono"
        aria-label="切换主题"
      >
        [ ]
      </button>
    );
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="text-xs text-muted hover:text-accent-green px-2 py-1 rounded cursor-pointer bg-transparent border-0 font-mono transition-colors"
      aria-label={isLight ? "switch to dark mode" : "switch to light mode"}
    >
      [{isLight ? "x" : " "}]
    </button>
  );
}
