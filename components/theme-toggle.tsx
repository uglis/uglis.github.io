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
        className="w-9 h-9 rounded-full border border-line bg-[rgba(10,14,24,0.72)] inline-flex items-center justify-center cursor-pointer"
        aria-label="切换主题"
      >
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current stroke-[1.9] fill-none">
          <path d="M19 15.2A8 8 0 1 1 8.8 5 6.5 6.5 0 1 0 19 15.2Z" />
        </svg>
      </button>
    );
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="w-9 h-9 rounded-full border border-line bg-[rgba(10,14,24,0.72)] inline-flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
      aria-label={isLight ? "切换到夜间模式" : "切换到白天模式"}
    >
      {isLight ? (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current stroke-[1.9] fill-none">
          <path d="M12 4.5V2.5M12 21.5v-2M6.35 6.35 4.93 4.93m14.14 14.14-1.42-1.42M4.5 12h-2m19 0h-2M6.35 17.65l-1.42 1.42m14.14-14.14-1.42 1.42M12 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current stroke-[1.9] fill-none">
          <path d="M19 15.2A8 8 0 1 1 8.8 5 6.5 6.5 0 1 0 19 15.2Z" />
        </svg>
      )}
    </button>
  );
}
