"use client";

import { useState } from "react";
import type { Post } from "@/lib/posts";
import type { Moment } from "@/lib/moments";
import { Terminal } from "./terminal";
import { NormalHome } from "./normal-home";

export function HomeViewSwitcher({
  posts,
  moments,
}: {
  posts: Post[];
  moments: Moment[];
}) {
  const [mode, setMode] = useState<"terminal" | "normal">("terminal");

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setMode(mode === "terminal" ? "normal" : "terminal")}
        className="fixed bottom-6 right-6 z-50 px-3.5 py-2 rounded-full border text-xs font-mono
          bg-black/40 backdrop-blur-xl border-white/[0.12] text-white/60
          hover:bg-black/60 hover:text-white/90 hover:border-white/[0.2]
          transition-all duration-300 shadow-lg shadow-black/20"
        aria-label={mode === "terminal" ? "切换到普通视图" : "切换到终端视图"}
      >
        {mode === "terminal" ? "□ 普通视图" : ">_ 终端视图"}
      </button>

      {mode === "terminal" ? (
        <Terminal posts={posts} moments={moments} />
      ) : (
        <NormalHome posts={posts} moments={moments} />
      )}
    </div>
  );
}
